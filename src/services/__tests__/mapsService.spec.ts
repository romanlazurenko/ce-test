import { MapsService } from "../mapsService";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadGoogleMaps } from "../../utils/googleMaps";

vi.mock("../../utils/googleMaps", () => ({
  loadGoogleMaps: vi.fn(),
}));

describe("MapsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("geocodeCity", () => {
    it("should successfully geocode a city", async () => {
      const mockLocation = {
        lat: () => 51.5074,
        lng: () => -0.1278,
      };

      const mockGeocoder = {
        geocode: vi.fn().mockResolvedValue({
          results: [
            {
              geometry: {
                location: mockLocation,
              },
            },
          ],
        }),
      };

      (global as any).google = {
        maps: {
          Geocoder: vi.fn().mockReturnValue(mockGeocoder),
        },
      };

      const result = await MapsService.geocodeCity("London");

      expect(loadGoogleMaps).toHaveBeenCalled();
      expect(mockGeocoder.geocode).toHaveBeenCalledWith({ address: "London" });
      expect(result).toEqual({
        lat: 51.5074,
        lng: -0.1278,
      });
    });

    it("should handle geocoding errors", async () => {
      const mockGeocoder = {
        geocode: vi.fn().mockRejectedValue(new Error("Geocoding failed")),
      };

      (global as any).google = {
        maps: {
          Geocoder: vi.fn().mockReturnValue(mockGeocoder),
        },
      };

      await expect(MapsService.geocodeCity("InvalidCity")).rejects.toThrow(
        "Geocoding failed"
      );
    });

    it("should format city name correctly", async () => {
      const mockLocation = {
        lat: () => 48.8566,
        lng: () => 2.3522,
      };

      const mockGeocoder = {
        geocode: vi.fn().mockResolvedValue({
          results: [
            {
              geometry: {
                location: mockLocation,
              },
            },
          ],
        }),
      };

      (global as any).google = {
        maps: {
          Geocoder: vi.fn().mockReturnValue(mockGeocoder),
        },
      };

      const result = await MapsService.geocodeCity("Paris, France");

      expect(mockGeocoder.geocode).toHaveBeenCalledWith({ address: "Paris" });
      expect(result).toEqual({
        lat: 48.8566,
        lng: 2.3522,
      });
    });
  });

  describe("getMapOptions", () => {
    it("should return correct map options", () => {
      const center = {
        lat: 51.5074,
        lng: -0.1278,
      };

      const options = MapsService.getMapOptions(center);

      expect(options).toEqual({
        center,
        zoom: 12,
        mapId: "DEMO_MAP_ID",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    });
  });
});
