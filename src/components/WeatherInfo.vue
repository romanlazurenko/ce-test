<template>
  <div v-if="props.city" class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-2xl font-semibold mb-4">Weather Information</h2>
    <div v-if="isLoading" class="flex justify-center items-center h-48">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex items-center space-x-4">
        <img
          :src="`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`"
          :alt="weather.weather?.[0]?.description"
          class="w-16 h-16"
        />
        <div>
          <h3 class="text-xl font-semibold">
            {{ weather.weather?.[0]?.main }}
          </h3>
          <p class="text-gray-600">{{ weather.weather?.[0]?.description }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Temperature</p>
          <p class="text-2xl font-bold">
            {{ Math.round(weather.main?.temp) }}°C
          </p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Humidity</p>
          <p class="text-2xl font-bold">{{ weather.main?.humidity }}%</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Wind Speed</p>
          <p class="text-2xl font-bold">{{ weather.wind?.speed }} m/s</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Feels Like</p>
          <p class="text-2xl font-bold">
            {{ Math.round(weather.main?.feels_like) }}°C
          </p>
        </div>
      </div>
      <div class="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Pressure</p>
          <p class="text-2xl font-bold">{{ weather.main?.pressure }} hPa</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Visibility</p>
          <p class="text-2xl font-bold">
            {{ Math.round(weather.visibility / 1000) }} km
          </p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Cloud Cover</p>
          <p class="text-2xl font-bold">{{ weather.clouds?.all }}%</p>
        </div>
        <div v-if="weather.rain?.['1h']" class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Rain (1h)</p>
          <p class="text-2xl font-bold">{{ weather.rain?.["1h"] }} mm</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { WeatherService, type WeatherData } from "../services/weatherService";

const props = defineProps<{
  city?: string;
}>();

const weather = ref<WeatherData>({} as WeatherData);
const isLoading = ref(false);
const error = ref<string | null>(null);

async function fetchWeather() {
  if (!props.city) {
    weather.value = {} as WeatherData;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    weather.value = await WeatherService.getWeather(props.city);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load weather information";
    console.error("Error fetching weather:", err);
    weather.value = {} as WeatherData;
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.city, fetchWeather, { immediate: true });
</script>
