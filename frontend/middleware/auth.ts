export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth();
  
  // ログインしていない場合はログインページにリダイレクト
  if (!isLoggedIn.value) {
    return navigateTo('/login');
  }
});