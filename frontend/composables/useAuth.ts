import { ref, computed } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuth = () => {
  // ユーザー情報をuseStateで管理（アプリ全体で共有）
  const user = useState<User | null>('user', () => null);
  const errorMsg = ref<string | null>(null);

  // ログイン状態の判定
  const isLoggedIn = computed(() => !!user.value);

  // 認証トークンを管理するためのCookie
  const accessToken = useCookie('access-token');
  const client = useCookie('client');
  const uid = useCookie('uid');

  // ヘッダー情報を保存
  function saveHeaders(headers: Headers) {
    const access = headers.get('access-token');
    const clientValue = headers.get('client');
    const uidValue = headers.get('uid');
    
    if (access) accessToken.value = access;
    if (clientValue) client.value = clientValue;
    if (uidValue) uid.value = uidValue;
  }

  // 認証ヘッダーを取得
  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (accessToken.value) headers['access-token'] = accessToken.value;
    if (client.value) headers['client'] = client.value;
    if (uid.value) headers['uid'] = uid.value;
    return headers;
  }

  // 認証状態の検証とユーザー情報の取得
  async function fetchUser() {
    if (!accessToken.value || !client.value || !uid.value) {
      return;
    }

    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBase || '';
      const response = await $fetch('/api/v1/auth/validate_token', {
        method: 'GET',
        baseURL: baseUrl,
        headers: {
          'Content-Type': 'application/json',
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
      console.error('認証エラー:', error);
      clearAuth();
    }
  }

  // 認証情報をクリア
  function clearAuth() {
    accessToken.value = null;
    client.value = null;
    uid.value = null;
    user.value = null;
  }

  // ログイン
  async function login(email: string, password: string) {
    errorMsg.value = null;
    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBase || '';
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
          console.error('Login error response:', response.status, response.statusText);
          console.error('Response body:', response._data);
        }
      });
      
      // ユーザー情報を取得
      user.value = response.data;
      
      return true;
    } catch (e: any) {
      console.error('Login error:', e);
      errorMsg.value = e.data?.errors?.join(', ') || e.message || "ログイン失敗";
      clearAuth();
      return false;
    }
  }

  // ログアウト
  async function logout() {
    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBase || '';
      await $fetch("/api/v1/auth/sign_out", {
        method: "DELETE",
        baseURL: baseUrl,
        headers: getHeaders(),
      });
    } finally {
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
    clearAuth
  };
};
