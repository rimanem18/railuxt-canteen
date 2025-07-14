export const useApi = <T = any>(path: string, options: any = {}) => {
  const base = useRuntimeConfig().public.apiBase;
  const url = `${base}${path}`;
  
  // 認証ヘッダーを取得
  const accessToken = useCookie('access-token');
  const client = useCookie('client');
  const uid = useCookie('uid');
  
  const authHeaders: Record<string, string> = {};
  if (accessToken.value) authHeaders['access-token'] = accessToken.value;
  if (client.value) authHeaders['client'] = client.value;
  if (uid.value) authHeaders['uid'] = uid.value;

  const { data, error, refresh } = useFetch<T>(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {})
    },
    onResponse({ response }) {
      // レスポンスヘッダーから新しい認証トークンを取得・保存
      const access = response.headers.get('access-token');
      const clientValue = response.headers.get('client');
      const uidValue = response.headers.get('uid');
      
      if (access) accessToken.value = access;
      if (clientValue) client.value = clientValue;
      if (uidValue) uid.value = uidValue;
    },
    onResponseError({ response }) {
      // 認証エラーの場合は認証情報をクリア
      if (response.status === 401) {
        accessToken.value = null;
        client.value = null;
        uid.value = null;
        // ユーザー情報もクリア
        const user = useState<any>('user', () => null);
        user.value = null;
      }
    },
  });

  if (error.value) {
    console.error("API error:", error.value);
  }

  return { data, error, refresh };
};
