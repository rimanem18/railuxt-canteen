<script setup lang="ts">
import OrderList from "~/components/OrderList.vue";

// 認証ミドルウェアを適用
definePageMeta({
  middleware: 'auth'
});

const { data: orders } = await useApi("/api/v1/orders");
const onComplete = async (id: number) => {
  await useApi(`/api/v1/orders/${id}`, { method: "PATCH", body: {} });
  location.reload();
};
</script>
<template>
  <OrderList :orders="orders" @complete="onComplete" />
</template>
