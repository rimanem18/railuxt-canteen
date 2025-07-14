<template>
  <NavBar />
  <div class="p-4 flex justify-center items-center flex-col min-w-[800px]">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { fetchUser } = useAuth();

// アプリケーションの初期化時に認証状態を復元
onMounted(async () => {
  await fetchUser();
});
</script>
