/**
 * API呼び出しを行うコンポーザブル関数
 * @param {string} path - APIのパス（例: "/api/v1/dishes"）
 * @param {any} options - useFetchのオプション（method, body, headers等）
 * @returns {{ data: T | null, error: any, refresh: () => void }} APIレスポンス、エラー、リフレッシュ関数
 */
export const useApi = <T = any>(path: string, options: any = {}) => {
  const base = useRuntimeConfig().public.apiBase;
  const url = `${base}${path}`;

  // DeviseTokenAuthで必要な認証ヘッダーを取得
  // 各リクエストでトークンを送信し、レスポンスで更新されたトークンを受け取る
  const accessToken = useCookie("access-token");
  const client = useCookie("client");
  const uid = useCookie("uid");

  const authHeaders: Record<string, string> = {};
  if (accessToken.value) authHeaders["access-token"] = accessToken.value;
  if (client.value) authHeaders["client"] = client.value;
  if (uid.value) authHeaders["uid"] = uid.value;

  const { data, error, refresh } = useFetch<T>(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
    onResponse({ response }) {
      // DeviseTokenAuthはリクエストごとにトークンを更新するため
      // レスポンスヘッダーから新しい認証トークンを取得・保存
      const access = response.headers.get("access-token");
      const clientValue = response.headers.get("client");
      const uidValue = response.headers.get("uid");

      if (access) accessToken.value = access;
      if (clientValue) client.value = clientValue;
      if (uidValue) uid.value = uidValue;
    },
    onResponseError({ response }) {
      // 401 Unauthorizedの場合は認証が無効になったと判断
      // 認証情報をクリアしてログイン画面への遷移を促す
      if (response.status === 401) {
        accessToken.value = null;
        client.value = null;
        uid.value = null;
        // ユーザー情報もクリア
        const user = useState<any>("user", () => null);
        user.value = null;
      }
    },
  });

  if (error.value) {
    console.error("API error:", error.value);
  }

  return { data, error, refresh };
};
