<script setup lang="ts">
const { data: health, pending, error } = await useFetch("/api/health");
</script>
<template>
  <HelloWorld name="Vue 3 + Vite + TypeScript" />
  <div v-if="pending">Loading…</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <pre v-else>{{ JSON.stringify(health, null, 2) }}</pre>
</template>
