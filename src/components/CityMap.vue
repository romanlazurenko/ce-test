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
let map: google.maps.Map | null = null;
let marker: google.maps.marker.AdvancedMarkerElement | null = null;

const DEFAULT_LOCATION: Location = {
  lat: 50.4501,
  lng: 30.5234,
};

async function initializeMap() {
  if (!mapContainer.value) return;

  await loadGoogleMaps();

  map = new google.maps.Map(
    mapContainer.value,
    MapsService.getMapOptions(DEFAULT_LOCATION)
  );

  if (!props.city) {
    marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: DEFAULT_LOCATION,
      title: "Kyiv",
    });
  }
}

async function updateMapLocation(city: string) {
  if (!map) return;

  try {
    const location = await MapsService.geocodeCity(city);
    map.setCenter(location);

    if (marker) {
      marker.map = null;
    }

    marker = new google.maps.marker.AdvancedMarkerElement({
      map,
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
    updateMapLocation(props.city);
  }
});

watch(
  () => props.city,
  (newCity) => {
    if (newCity) {
      updateMapLocation(newCity);
    }
  }
);
</script>
