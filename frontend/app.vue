<script setup lang="ts">
import { useApi } from "@/composables/useApi";

const { data, error } = await useApi("/api/v1/health/show");

// name をリアクティブな computed で取り出す
const name = computed(() => {
  if (error.value) {
    console.log("data value:", data.value);
    console.error("error value: ", error.value);
    return "エラー";
  }
  console.log("data value:", data.value);
  return data.value?.name ?? "";
});
</script>
<template>
  <HelloWorld :name="name || ''" />
</template>
