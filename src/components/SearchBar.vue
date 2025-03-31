<template>
  <div class="mb-8">
    <div class="max-w-2xl mx-auto">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search" />
        <InputText
          :value="modelValue"
          placeholder="Enter city name..."
          class="w-full"
          @input="
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
          "
        />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from "primevue/inputtext";

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped>
.p-inputtext {
  @apply w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500;
}
</style>
