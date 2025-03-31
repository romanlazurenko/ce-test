export const config = {
  openWeatherApi: {
    key: import.meta.env.VITE_OPENWEATHER_API_KEY,
    baseUrl: "https://api.openweathermap.org/data/2.5",
  },
  googleMaps: {
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    zoom: 12,
  },
  unsplash: {
    applicationId: import.meta.env.VITE_UNSPLASH_APPLICATION_ID,
    accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  },
} as const;
