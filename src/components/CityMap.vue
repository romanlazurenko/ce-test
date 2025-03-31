<template>
  <div v-show="props.city" class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-2xl font-semibold mb-4">City Map</h2>
    <div ref="mapContainer" class="h-[600px] rounded-lg overflow-hidden"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { loadGoogleMaps } from "../utils/googleMaps";
import { MapsService, type Location } from "../services/mapsService";

const props = defineProps<{
  city?: string;
}>();

const mapContainer = ref<HTMLElement | null>(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.marker.AdvancedMarkerElement | null>(null);

const DEFAULT_LOCATION: Location = {
  lat: 50.4501,
  lng: 30.5234,
};

async function initializeMap() {
  if (!mapContainer.value) return;

  await loadGoogleMaps();

  map.value = new google.maps.Map(
    mapContainer.value,
    MapsService.getMapOptions(DEFAULT_LOCATION)
  );

  if (!props.city) {
    marker.value = new google.maps.marker.AdvancedMarkerElement({
      map: map.value,
      position: DEFAULT_LOCATION,
      title: "Kyiv",
    });
  }
}

async function updateMapLocation(city: string) {
  if (!map.value) return;

  try {
    const location = await MapsService.geocodeCity(city);
    map.value.setCenter(location);

    if (marker.value) {
      marker.value.map = null;
    }

    marker.value = new google.maps.marker.AdvancedMarkerElement({
      map: map.value,
      position: location,
      title: city,
    });
  } catch (error) {
    console.error("Error updating map location:", error);
  }
}

onMounted(async () => {
  await initializeMap();
  if (props.city) {
    await updateMapLocation(props.city);
  }
});

watch(
  () => props.city,
  async (newCity) => {
    if (newCity) {
      await updateMapLocation(newCity);
    }
  },
  { immediate: true }
);
</script>
