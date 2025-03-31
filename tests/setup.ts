import { config } from "@vue/test-utils";
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import { vi } from "vitest";

// Mock environment variables
vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "test_google_maps_key");
vi.stubEnv("VITE_OPENWEATHER_API_KEY", "test_openweather_key");
vi.stubEnv("VITE_UNSPLASH_ACCESS_KEY", "test_unsplash_key");
vi.stubEnv("VITE_API_NINJAS_KEY", "test_api_ninjas_key");

// Mock Google Maps
global.google = {
  maps: {
    Geocoder: vi.fn(),
    Map: vi.fn(),
    places: {
      AutocompleteSessionToken: vi.fn(),
      AutocompleteSuggestion: vi.fn(),
    },
    marker: {
      AdvancedMarkerElement: vi.fn(),
    },
  },
} as any;

// Configure Vue Test Utils
config.global.plugins = [PrimeVue];
