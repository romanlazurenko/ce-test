import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CityMap from "../CityMap.vue";
import { MapsService } from "../../services/mapsService";

vi.mock("../../services/mapsService", () => ({
  MapsService: {
    geocodeCity: vi.fn(),
    getMapOptions: vi.fn(),
  },
}));

vi.mock("../../utils/googleMaps", () => ({
  loadGoogleMaps: vi.fn(),
}));

describe("CityMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle geocoding errors gracefully", async () => {
    (MapsService.geocodeCity as any).mockRejectedValue(
      new Error("Geocoding failed")
    );

    const wrapper = mount(CityMap, {
      props: {
        city: "InvalidCity",
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".bg-white").exists()).toBe(true);
  });
});
