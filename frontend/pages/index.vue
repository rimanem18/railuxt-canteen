<script setup lang="ts">
import DishCard from "~/components/DishCard.vue";
const { data: dishes } = await useApi("/api/v1/dishes");
const onOrder = async (id: number) => {
  await useApi("/api/v1/orders", {
    method: "POST",
    body: { order: { dish_id: id, quantity: 1 } },
  });
  alert("注文しました");
};
</script>
<template>
  <h1 class="text-2xl mb-4">料理一覧</h1>
  <div class="grid grid-cols-4 gap-2">
    <DishCard v-for="d in dishes" :key="d.id" :dish="d" @order="onOrder" />
  </div>
</template>
