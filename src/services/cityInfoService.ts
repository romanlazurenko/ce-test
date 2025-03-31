import { MapsService } from "./mapsService";
import { config } from "../config/env";

interface CountryFlagResponse {
  country: string;
  square_image_url: string;
  rectangle_image_url: string;
}

interface CityInfo {
  countryCode: string;
  countryName: string;
  flagUrl: string;
}

export class CityInfoService {
  private static async getCountryFlag(countryCode: string): Promise<string> {
    try {
      const url = `${config.apiNinjas.baseUrl}/countryflag?country=${countryCode}`;

      const response = await fetch(url, {
        headers: {
          "X-Api-Key": config.apiNinjas.key,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch country flag: ${response.status} ${response.statusText}`
        );
      }

      const data: CountryFlagResponse = await response.json();
      return data.square_image_url;
    } catch (error) {
      console.error("Error fetching country flag:", error);
      return "";
    }
  }

  static async getCityInfo(city: string): Promise<CityInfo> {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult>(
        (resolve, reject) => {
          geocoder.geocode({ address: city }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              resolve(results[0]);
            } else {
              reject(new Error("Geocoding failed"));
            }
          });
        }
      );

      const countryComponent = result.address_components.find((component) =>
        component.types.includes("country")
      );

      if (!countryComponent) {
        throw new Error("Country not found");
      }

      const countryCode = countryComponent.short_name;
      const countryName = countryComponent.long_name;
      const flagUrl = await this.getCountryFlag(countryCode);

      return {
        countryCode,
        countryName,
        flagUrl,
      };
    } catch (error) {
      console.error("Error fetching city info:", error);
      throw error;
    }
  }
}
