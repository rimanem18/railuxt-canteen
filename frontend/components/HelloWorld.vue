<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ name: string }>();
</script>

<template>
  <div>
    <p>Hello World, {{ props.name }}</p>
  </div>
</template>
