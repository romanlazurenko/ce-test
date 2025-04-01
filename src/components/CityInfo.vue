<template>
  <div
    v-if="props.city"
    class="bg-white rounded-lg shadow-sm p-6 mb-8 max-h-[192px]"
  >
    <h2 class="text-2xl font-semibold mb-4">City Information</h2>
    <div v-if="isLoading" class="flex justify-center items-center h-24">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>
    <div v-else-if="cityInfo" class="flex items-center space-x-6">
      <div class="w-24 h-24 rounded-lg overflow-hidden shadow-sm">
        <img
          :src="cityInfo.flagUrl"
          :alt="`${cityInfo.countryName} flag`"
          class="w-full h-full object-cover"
        />
      </div>
      <div>
        <h3 class="text-xl font-semibold text-gray-900">
          {{ cityInfo.countryName }}
        </h3>
        <p class="text-gray-600">{{ cityInfo.countryCode }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { CityInfoService } from "../services/cityInfoService";

const props = defineProps<{
  city?: string;
}>();

const cityInfo = ref<{
  countryCode: string;
  countryName: string;
  flagUrl: string;
} | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchCityInfo() {
  if (!props.city) {
    cityInfo.value = null;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    cityInfo.value = await CityInfoService.getCityInfo(props.city);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to fetch city information";
    console.error("Error fetching city info:", err);
    cityInfo.value = null;
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.city, fetchCityInfo, { immediate: true });
</script>

<style scoped>
.city-info {
  background: var(--surface-card);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: var(--card-shadow);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.error {
  color: var(--red-500);
  text-align: center;
  padding: 1rem;
}

.info-content {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.flag-container {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.flag {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details {
  flex: 1;
}

.country {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
