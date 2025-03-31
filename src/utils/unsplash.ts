import { config } from "../config/env";

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  alt_description: string;
}

export async function getCityPhotos(city: string): Promise<UnsplashPhoto[]> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        city
      )}&orientation=landscape&per_page=12`,
      {
        headers: {
          Authorization: `Client-ID ${config.unsplash.accessKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch photos");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching city photos:", error);
    throw error;
  }
}
