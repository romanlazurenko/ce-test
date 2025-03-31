<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-2xl font-semibold mb-4">City Map</h2>
    <div ref="mapContainer" class="h-[600px] rounded-lg overflow-hidden"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { config } from "../config/env";

const props = defineProps<{
  city?: string;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: google.maps.Map | null = null;
let geocoder: google.maps.Geocoder | null = null;

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMaps.key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

async function initializeMap() {
  if (!mapContainer.value) return;

  await loadGoogleMapsScript();

  const defaultLocation = { lat: 0, lng: 0 };

  map = new google.maps.Map(mapContainer.value, {
    center: defaultLocation,
    zoom: config.googleMaps.zoom,
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
      new google.maps.Marker({
        map,
        position: location,
        animation: google.maps.Animation.DROP,
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
