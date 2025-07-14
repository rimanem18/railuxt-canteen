<template>
  <nav class="p-4 bg-gray-100 flex justify-between items-center">
    <div class="flex items-center space-x-4">
      <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
      <NuxtLink v-if="isLoggedIn" to="/orders" class="hover:text-blue-600">Orders</NuxtLink>
    </div>
    
    <div class="flex items-center space-x-4">
      <div v-if="isLoggedIn" class="flex items-center space-x-4">
        <span class="text-gray-700">ようこそ、{{ user?.name }}さん</span>
        <button 
          @click="handleLogout" 
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          ログアウト
        </button>
      </div>
      <div v-else>
        <NuxtLink to="/login" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          ログイン
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, isLoggedIn, logout } = useAuth();

const handleLogout = async () => {
  await logout();
  await navigateTo('/');
};
</script>
