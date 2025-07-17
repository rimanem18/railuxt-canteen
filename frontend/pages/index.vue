<script setup lang="ts">
import DishCard from "~/components/DishCard.vue";
const { data: dishes } = await useApi("/api/v1/dishes");
/**
 * 料理を注文する処理
 * @param id - 注文する料理のID
 */
const onOrder = async (id: number) => {
  // 注文数量は固定で1としている（将来的にはユーザーが数量を選択できるようにする可能性がある）
  await useApi("/api/v1/orders", {
    method: "POST",
    body: { order: { dish_id: id, quantity: 1 } },
  });
  // 簡易的な成功通知（将来的にはトーストやモーダルなどのより良いUIに変更する）
  alert("注文しました");
};
</script>
<template>
  <h1 class="text-2xl mb-4">料理一覧</h1>
  <div class="grid grid-cols-4 gap-2">
    <DishCard v-for="d in dishes" :key="d.id" :dish="d" @order="onOrder" />
  </div>
</template>
