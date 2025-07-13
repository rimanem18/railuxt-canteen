import { ref } from "vue";

const tokenKeys = ["access-token", "client", "uid"];
const AUTH_KEY = "auth-headers";

export const useAuth = () => {
  const isLoggedIn = ref(false);
  const errorMsg = ref<string | null>(null);

  // ヘッダー情報を保存
  function saveHeaders(headers: Headers) {
    const obj: Record<string, string> = {};
    tokenKeys.forEach((key) => {
      const value = headers.get(key);
      if (value) obj[key] = value;
    });
    localStorage.setItem(AUTH_KEY, JSON.stringify(obj));
  }

  function getHeaders(): Record<string, string> {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) || "{}");
    } catch {
      return {};
    }
  }

  // ログイン
  async function login(email: string, password: string) {
    errorMsg.value = null;
    try {
      const res = await fetch("/api/v1/auth/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("ログイン失敗");
      saveHeaders(res.headers);
      isLoggedIn.value = true;
      return true;
    } catch (e: any) {
      errorMsg.value = e.message;
      isLoggedIn.value = false;
      return false;
    }
  }

  // ログアウト
  async function logout() {
    try {
      const headers = getHeaders();
      await fetch("/api/v1/auth/sign_out", {
        method: "DELETE",
        headers,
      });
    } finally {
      localStorage.removeItem(AUTH_KEY);
      isLoggedIn.value = false;
    }
  }

  // API ヘッダー付与
  function withAuthHeaders(init: RequestInit = {}) {
    const headers = getHeaders();
    return {
      ...init,
      headers: { ...(init.headers || {}), ...headers },
    };
  }

  return { login, logout, withAuthHeaders, isLoggedIn, errorMsg };
};
