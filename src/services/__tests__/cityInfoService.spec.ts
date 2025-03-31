import { CityInfoService } from "../cityInfoService";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("CityInfoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCityInfo", () => {
    it("should fetch city info successfully", async () => {
      const mockGeocoderResult = {
        address_components: [
          {
            long_name: "United Kingdom",
            short_name: "GB",
            types: ["country"],
          },
        ],
      };

      const mockGeocoder = {
        geocode: vi.fn((params, callback) => {
          callback([mockGeocoderResult], "OK");
        }),
      };

      (global.google.maps.Geocoder as any).mockImplementation(
        () => mockGeocoder
      );

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            country: "GB",
            square_image_url: "https://example.com/flag.png",
            rectangle_image_url: "https://example.com/flag-rect.png",
          }),
      });

      const result = await CityInfoService.getCityInfo("London");

      expect(result).toEqual({
        countryCode: "GB",
        countryName: "United Kingdom",
        flagUrl: "https://example.com/flag.png",
      });

      expect(mockGeocoder.geocode).toHaveBeenCalledWith(
        { address: "London" },
        expect.any(Function)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/countryflag?country=GB"),
        expect.any(Object)
      );
    });

    it("should handle geocoding failure", async () => {
      const mockGeocoder = {
        geocode: vi.fn((params, callback) => {
          callback([], "ZERO_RESULTS");
        }),
      };

      (global.google.maps.Geocoder as any).mockImplementation(
        () => mockGeocoder
      );

      await expect(CityInfoService.getCityInfo("InvalidCity")).rejects.toThrow(
        "Geocoding failed"
      );
    });

    it("should handle missing country component", async () => {
      const mockGeocoder = {
        geocode: vi.fn((params, callback) => {
          callback([{ address_components: [] }], "OK");
        }),
      };

      (global.google.maps.Geocoder as any).mockImplementation(
        () => mockGeocoder
      );

      await expect(
        CityInfoService.getCityInfo("CityWithoutCountry")
      ).rejects.toThrow("Country not found");
    });

    it("should handle flag API failure", async () => {
      const mockGeocoder = {
        geocode: vi.fn((params, callback) => {
          callback(
            [
              {
                address_components: [
                  {
                    long_name: "United Kingdom",
                    short_name: "GB",
                    types: ["country"],
                  },
                ],
              },
            ],
            "OK"
          );
        }),
      };

      (global.google.maps.Geocoder as any).mockImplementation(
        () => mockGeocoder
      );

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const result = await CityInfoService.getCityInfo("London");

      expect(result).toEqual({
        countryCode: "GB",
        countryName: "United Kingdom",
        flagUrl: "",
      });
    });
  });
});
