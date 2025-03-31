<template>
  <div class="mb-8">
    <div class="max-w-2xl mx-auto">
      <AutoComplete
        v-model="searchValue"
        :suggestions="suggestions"
        @complete="searchCities"
        @item-select="handleSelect"
        placeholder="Enter city name..."
        :dropdown="true"
        class="w-full"
        optionLabel="description"
        :loading="isLoading"
      >
        <template #item="{ item }">
          <div class="flex align-items-center">
            <i class="pi pi-map-marker mr-2" />
            <span>{{ item.description }}</span>
          </div>
        </template>
      </AutoComplete>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import AutoComplete from "primevue/autocomplete";
import { getPlacePredictions, type PlacePrediction } from "../utils/googleMaps";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const searchValue = ref(props.modelValue);
const suggestions = ref<PlacePrediction[]>([]);
const isLoading = ref(false);

async function searchCities(event: { query: string }) {
  const value = event.query;

  if (!value) {
    suggestions.value = [];
    return;
  }

  try {
    isLoading.value = true;
    suggestions.value = await getPlacePredictions(value);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    suggestions.value = [];
  } finally {
    isLoading.value = false;
  }
}

function handleSelect(event: { value: PlacePrediction }) {
  emit("update:modelValue", event.value.description);
}

watch(
  () => props.modelValue,
  (newValue) => {
    searchValue.value = newValue;
  }
);
</script>

<style lang="scss">
.p-autocomplete {
  width: 100%;

  .p-autocomplete-input {
    @apply w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500;
  }

  .p-autocomplete-panel {
    @apply mt-1 bg-white rounded-lg shadow-lg;
  }

  .p-autocomplete-items {
    @apply py-1;
  }

  .p-autocomplete-item {
    @apply px-4 py-2 hover:bg-gray-100 cursor-pointer;
  }
}
</style>
