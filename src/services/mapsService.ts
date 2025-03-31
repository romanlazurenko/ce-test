import { loadGoogleMaps } from "../utils/googleMaps";
import { config } from "../config/env";

export interface Location {
  lat: number;
  lng: number;
}

export class MapsService {
  private static formatCityName(city: string): string {
    return city.split(/\s*[-,]\s*/)[0].trim();
  }

  static async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          resolve({ lat: 0, lng: 0 });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }

  static async geocodeCity(city: string): Promise<Location> {
    await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    const cityName = this.formatCityName(city);

    try {
      const result = await geocoder.geocode({ address: cityName });
      if (result.results[0]?.geometry?.location) {
        const location = result.results[0].geometry.location;
        return {
          lat: location.lat(),
          lng: location.lng(),
        };
      }
      throw new Error("Location not found");
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw new Error("Failed to geocode city");
    }
  }

  static getMapOptions(center: Location) {
    return {
      center,
      zoom: config.googleMaps.zoom,
      mapId: "DEMO_MAP_ID",
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    };
  }
}
