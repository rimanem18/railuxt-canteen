<template>
  <div
    class="border p-4 rounded-lg shadow hover:shadow-md transition-shadow min-w-64"
  >
    <h2 class="font-bold text-lg">{{ dish.name }}</h2>
    <p class="mt-2 text-sm">¥{{ dish.price }}</p>
    <button
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      @click="$emit('order', dish.id)"
    >
      注文する
    </button>
  </div>
</template>

<script setup lang="ts">
interface Dish {
  id: number;
  name: string;
  price: number;
}

defineProps<{ dish: Dish }>();
</script>
