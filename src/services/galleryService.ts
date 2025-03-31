import { getCityPhotos } from "../utils/unsplash";

export interface Photo {
  id: string;
  urls: {
    regular: string;
  };
  alt_description?: string;
}

export class GalleryService {
  private static formatCityName(city: string): string {
    return city.split(/\s*[-,]\s*/)[0].trim();
  }

  static async getCityPhotos(city: string): Promise<Photo[]> {
    const cityName = this.formatCityName(city);
    return getCityPhotos(cityName);
  }
}
