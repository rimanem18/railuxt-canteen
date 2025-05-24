<script setup lang="ts">
type Data = {
  name: string;
};

const { data, pending, error } = await useFetch<Data | null>("/api/name");
</script>
<template>
  <HelloWorld :name="data?.name || ''" />
</template>
