<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-2xl font-semibold mb-4">Weather Information</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-blue-50 p-8 rounded-lg text-center">
        <div class="text-6xl font-bold text-blue-600 mb-2">
          {{ temperature }}°C
        </div>
        <div class="text-gray-600 text-lg">Temperature</div>
      </div>
      <div class="bg-green-50 p-8 rounded-lg text-center">
        <div class="text-6xl font-bold text-green-600 mb-2">
          {{ humidity }}%
        </div>
        <div class="text-gray-600 text-lg">Humidity</div>
      </div>
      <div class="bg-purple-50 p-8 rounded-lg text-center">
        <div class="text-6xl font-bold text-purple-600 mb-2">
          {{ conditions }}
        </div>
        <div class="text-gray-600 text-lg">Conditions</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { config } from "../config/env";

const props = defineProps<{
  city?: string;
}>();

const temperature = ref<string | number>("--");
const humidity = ref<string | number>("--");
const conditions = ref<string>("--");

async function fetchWeatherData(city: string) {
  try {
    const response = await fetch(
      `${config.openWeatherApi.baseUrl}/weather?q=${city}&appid=${config.openWeatherApi.key}&units=metric`
    );
    const data = await response.json();

    if (data.main) {
      temperature.value = Math.round(data.main.temp);
      humidity.value = data.main.humidity;
      conditions.value = data.weather[0]?.description || "--";
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    temperature.value = "--";
    humidity.value = "--";
    conditions.value = "--";
  }
}

watch(
  () => props.city,
  (newCity) => {
    if (newCity) {
      fetchWeatherData(newCity);
    }
  }
);
</script>
