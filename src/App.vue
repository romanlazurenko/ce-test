<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="w-full px-8 py-4">
        <h1
          class="text-3xl font-bold text-gray-900 w-full max-w-7xl mx-auto lg:px-8 md:px-4"
        >
          City Explorer
        </h1>
      </div>
    </header>

    <main class="w-full max-w-7xl mx-auto px-8 py-6 rounded-lg">
      <SearchBar v-model="searchQuery" />
      <WeatherInfo :city="searchQuery" />
      <CityMap :city="searchQuery" />
      <CityGallery :city="searchQuery" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SearchBar from "./components/SearchBar.vue";
import WeatherInfo from "./components/WeatherInfo.vue";
import CityMap from "./components/CityMap.vue";
import CityGallery from "./components/CityGallery.vue";

const searchQuery = ref("");
</script>

<style scoped>
.p-inputtext {
  @apply w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500;
}
</style>
