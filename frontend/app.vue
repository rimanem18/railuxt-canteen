<script setup lang="ts">
type Health = {
  status: string;
  name: string;
};

const {
  data: health,
  pending: healthPending,
  error: healthError,
} = await useFetch<Health | null>("/api/v1/health/show");
</script>
<template>
  <HelloWorld :name="health?.name || ''" />
</template>
