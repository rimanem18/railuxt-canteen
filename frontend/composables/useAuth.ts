import { ref, computed } from "vue";

/** ユーザー情報の型定義 */
interface User {
  /** ユーザーID */
  id: number;
  /** ユーザー名 */
  name: string;
  /** メールアドレス */
  email: string;
}

/**
 * 認証機能を提供するコンポーザブル関数
 * @returns {object} 認証状態とログイン・ログアウト関数
 */
export const useAuth = () => {
  // ユーザー情報をuseStateで管理（アプリ全体で共有）
  // リロードしても状態が保持される
  const user = useState<User | null>("user", () => null);
  const errorMsg = ref<string | null>(null);

  // ログイン状態の判定
  const isLoggedIn = computed(() => !!user.value);

  // DeviseTokenAuthで必要な認証トークンを管理するためのCookie
  const accessToken = useCookie("access-token");
  const client = useCookie("client");
  const uid = useCookie("uid");

  /**
   * レスポンスヘッダーから認証トークンを取得してCookieに保存
   * @param {Headers} headers - レスポンスヘッダー
   */
  function saveHeaders(headers: Headers) {
    const access = headers.get("access-token");
    const clientValue = headers.get("client");
    const uidValue = headers.get("uid");

    if (access) accessToken.value = access;
    if (clientValue) client.value = clientValue;
    if (uidValue) uid.value = uidValue;
  }

  /**
   * API呼び出し用の認証ヘッダーを取得
   * @returns {Record<string, string>} 認証ヘッダー
   */
  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (accessToken.value) headers["access-token"] = accessToken.value;
    if (client.value) headers["client"] = client.value;
    if (uid.value) headers["uid"] = uid.value;
    return headers;
  }

  /**
   * 保存されたトークンを使用してユーザー情報を取得
   * @returns {Promise<void>} 取得処理の完了を待つPromise
   */
  async function fetchUser() {
    // 必要なトークンが全て揃っていない場合は処理をスキップ
    if (!accessToken.value || !client.value || !uid.value) {
      return;
    }

    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBase || "";
      const response = await $fetch("/api/v1/auth/validate_token", {
        method: "GET",
        baseURL: baseUrl,
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        onResponse({ response }) {
          // トークンの更新
          saveHeaders(response.headers);
        },
      });

      // ユーザー情報の取得
      user.value = response.data;
    } catch (error) {
      console.error("認証エラー:", error);
      clearAuth();
    }
  }

  /**
   * 認証情報を全てクリア
   */
  function clearAuth() {
    accessToken.value = null;
    client.value = null;
    uid.value = null;
    user.value = null;
  }

  /**
   * メールアドレスとパスワードでログイン
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise<boolean>} ログイン成功時true、失敗時false
   */
  async function login(email: string, password: string) {
    errorMsg.value = null;
    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBase || "";
      const response = await $fetch("/api/v1/auth/sign_in", {
        method: "POST",
        baseURL: baseUrl,
        headers: { "Content-Type": "application/json" },
        body: { email, password },
        onResponse({ response }) {
          // トークンを保存
          saveHeaders(response.headers);
        },
        onResponseError({ response }) {
          // デバッグ用ログ出力
          console.error(
            "Login error response:",
            response.status,
            response.statusText,
          );
          console.error("Response body:", response._data);
        },
      });

      // ユーザー情報を取得
      user.value = response.data;

      return true;
    } catch (e: any) {
      console.error("Login error:", e);
      // エラーメッセージの優先順位：API側のエラー配列 > 通常のエラーメッセージ > デフォルトメッセージ
      errorMsg.value =
        e.data?.errors?.join(", ") || e.message || "ログイン失敗";
      clearAuth();
      return false;
    }
  }

  /**
   * ログアウト処理
   * @returns {Promise<void>} ログアウト処理の完了を待つPromise
   */
  async function logout() {
    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBase || "";
      await $fetch("/api/v1/auth/sign_out", {
        method: "DELETE",
        baseURL: baseUrl,
        headers: getHeaders(),
      });
    } finally {
      // API呼び出しの成功・失敗に関わらず認証情報をクリア
      clearAuth();
    }
  }

  return {
    user,
    isLoggedIn,
    errorMsg,
    login,
    logout,
    fetchUser,
    saveHeaders,
    clearAuth,
  };
};
