<template>
  <ul>
    <li
      v-for="order in orders"
      :key="order.id"
      class="flex items-center justify-between p-2 border-b"
    >
      <div>
        <span class="font-medium">{{ order.dish.name }}</span>
        <span class="ml-2 text-gray-600">× {{ order.quantity }}</span>
        <span v-if="order.status" class="ml-2 text-gray-500">(提供済み)</span>
      </div>
      <button
        v-if="!order.status"
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        @click="$emit('complete', order.id)"
      >
        提供済みにする
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Dish {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  quantity: number;
  status: boolean;
  dish: Dish;
}

defineProps<{ orders: Order[] }>();
</script>
