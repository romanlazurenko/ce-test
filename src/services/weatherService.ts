import { config } from "../config/env";

export interface WeatherData {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    "1h"?: number;
  };
  visibility: number;
}

export class WeatherService {
  private static formatCityName(city: string): string {
    return city.split(/\s*[-,]\s*/)[0].trim();
  }

  static async getWeather(city: string): Promise<WeatherData> {
    const cityName = this.formatCityName(city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&appid=${config.openWeatherApi.key}&units=metric`
    );

    const data = await response.json();

    if (data.cod === "404") {
      throw new Error("City not found");
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weather data");
    }

    return data;
  }
}
