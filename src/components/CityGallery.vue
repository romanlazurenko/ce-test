<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-semibold mb-4">City Gallery</h2>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
    >
      <div
        v-for="n in 12"
        :key="n"
        class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
      >
        <span class="text-gray-500">Image {{ n }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  city?: string;
}>();
</script>
