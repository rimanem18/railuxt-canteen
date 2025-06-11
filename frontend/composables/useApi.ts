export const useApi = <T = any>(path: string, options = {}) => {
  const base = useRuntimeConfig().public.apiBase;
  const url = `${base}${path}`;
  const { data, error, refresh } = useFetch<T>(url, options);
  if (error.value) {
    console.error("API error:", error.value);
  }
  return { data, error, refresh };
};
