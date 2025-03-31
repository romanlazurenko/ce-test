/// <reference types="@types/google.maps" />
import { config } from "../config/env";

declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Geocoder: any;
        places: {
          AutocompleteSessionToken: any;
          AutocompleteSuggestion: any;
        };
        marker: {
          AdvancedMarkerElement: any;
        };
      };
    };
  }
}

let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export async function loadGoogleMaps(): Promise<void> {
  if (isLoaded) return;
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      isLoaded = true;
      resolve();
      return;
    }

    if (isLoading) return;
    isLoading = true;

    const callbackName = "googleMapsCallback";
    (window as any)[callbackName] = () => {
      isLoaded = true;
      isLoading = false;
      delete (window as any)[callbackName];
      resolve();
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMaps.key}&libraries=places,marker&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      isLoading = false;
      reject(new Error("Failed to load Google Maps"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

export interface PlacePrediction {
  place_id: string;
  description: string;
}

interface AutocompleteSuggestion {
  placePrediction: {
    placeId: string;
    text: {
      text: string;
    };
    types?: string[];
  };
}

export async function getPlacePredictions(
  input: string
): Promise<PlacePrediction[]> {
  await loadGoogleMaps();

  try {
    const sessionToken = new google.maps.places.AutocompleteSessionToken();
    const request = {
      input,
      sessionToken,
      locationBias: {
        radius: 50000,
        center: { lat: 0, lng: 0 },
      },
    };

    const { suggestions } =
      await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
        request
      );

    return (suggestions as AutocompleteSuggestion[])
      .filter(
        (suggestion) =>
          suggestion.placePrediction.types?.includes("locality") ||
          suggestion.placePrediction.types?.includes(
            "administrative_area_level_1"
          )
      )
      .map((suggestion) => ({
        place_id: suggestion.placePrediction.placeId,
        description: suggestion.placePrediction.text.text,
      }));
  } catch (error) {
    console.error("Error fetching place predictions:", error);
    return [];
  }
}
