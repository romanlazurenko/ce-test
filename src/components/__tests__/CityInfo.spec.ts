import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CityInfo from "../CityInfo.vue";
import { CityInfoService } from "../../services/cityInfoService";

vi.mock("../../services/cityInfoService", () => ({
  CityInfoService: {
    getCityInfo: vi.fn(),
  },
}));

describe("CityInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    const wrapper = mount(CityInfo, {
      props: {
        city: "London",
      },
    });

    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("should display city info when data is loaded", async () => {
    const mockCityInfo = {
      countryCode: "GB",
      countryName: "United Kingdom",
      flagUrl: "https://example.com/flag.png",
    };

    (CityInfoService.getCityInfo as jest.Mock).mockResolvedValue(mockCityInfo);

    const wrapper = mount(CityInfo, {
      props: {
        city: "London",
      },
    });

    await wrapper.vm.$nextTick();

    const flag = wrapper.find("img");
    expect(flag.attributes("src")).toBe(mockCityInfo.flagUrl);
    expect(flag.attributes("alt")).toBe(`${mockCityInfo.countryName} flag`);

    const countryName = wrapper.find("h3");
    expect(countryName.text()).toBe(mockCityInfo.countryName);

    const countryCode = wrapper.find("p");
    expect(countryCode.text()).toBe(mockCityInfo.countryCode);
  });

  it("should display error message when API call fails", async () => {
    const errorMessage = "Failed to fetch city information";
    (CityInfoService.getCityInfo as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const wrapper = mount(CityInfo, {
      props: {
        city: "InvalidCity",
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".text-red-500").text()).toBe(errorMessage);
  });

  it("should not display anything when no city is provided", () => {
    const wrapper = mount(CityInfo, {
      props: {
        city: "",
      },
    });

    expect(wrapper.find(".bg-white").exists()).toBe(false);
  });

  it("should update when city prop changes", async () => {
    const wrapper = mount(CityInfo, {
      props: {
        city: "London",
      },
    });

    expect(CityInfoService.getCityInfo).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ city: "Paris" });
    await wrapper.vm.$nextTick();

    expect(CityInfoService.getCityInfo).toHaveBeenCalledTimes(2);
  });
});
