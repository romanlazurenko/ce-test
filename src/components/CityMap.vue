<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-2xl font-semibold mb-4">City Map</h2>
    <div ref="mapContainer" class="h-[600px] rounded-lg overflow-hidden"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { config } from "../config/env";
import { loadGoogleMaps } from "../utils/googleMaps";

const props = defineProps<{
  city?: string;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: google.maps.Map | null = null;
let geocoder: google.maps.Geocoder | null = null;
let marker: google.maps.marker.AdvancedMarkerElement | null = null;

async function initializeMap() {
  if (!mapContainer.value) return;

  await loadGoogleMaps();

  const defaultLocation = { lat: 0, lng: 0 };

  map = new google.maps.Map(mapContainer.value, {
    center: defaultLocation,
    zoom: config.googleMaps.zoom,
    mapId: "DEMO_MAP_ID",
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  geocoder = new google.maps.Geocoder();
}

async function updateMapLocation(city: string) {
  if (!map || !geocoder) return;

  try {
    const result = await geocoder.geocode({ address: city });
    if (result.results[0]?.geometry?.location) {
      const location = result.results[0].geometry.location;
      map.setCenter(location);

      if (marker) {
        marker.map = null;
      }

      marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: location,
        title: city,
      });
    }
  } catch (error) {
    console.error("Error geocoding address:", error);
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
