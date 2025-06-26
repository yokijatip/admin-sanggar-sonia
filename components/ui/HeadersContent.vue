<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">{{ title }}</h1>
      <p class="text-muted-foreground">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
// Props untuk menerima data dari komponen induk
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<style></style>
