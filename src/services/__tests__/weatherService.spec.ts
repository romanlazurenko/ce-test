import { describe, it, expect, vi, beforeEach } from "vitest";
import { WeatherService } from "../weatherService";

describe("WeatherService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWeather", () => {
    it("should fetch weather data successfully", async () => {
      const mockWeatherResponse = {
        weather: [
          {
            description: "clear sky",
            icon: "01d",
            main: "Clear",
          },
        ],
        main: {
          temp: 20,
          feels_like: 19,
          humidity: 65,
          pressure: 1015,
        },
        wind: {
          speed: 5,
        },
        visibility: 10000,
        clouds: {
          all: 0,
        },
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockWeatherResponse),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await WeatherService.getWeather("London");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api.openweathermap.org/data/2.5/weather")
      );
      expect(result).toEqual(mockWeatherResponse);
    });

    it("should handle weather API errors", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({ message: "Failed to fetch weather data" }),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await expect(WeatherService.getWeather("London")).rejects.toThrow(
        "Failed to fetch weather data"
      );
    });

    it("should handle city not found error", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ cod: "404" }),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await expect(WeatherService.getWeather("InvalidCity")).rejects.toThrow(
        "City not found"
      );
    });
  });
});
