import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WeatherInfo from "../WeatherInfo.vue";
import { WeatherService } from "../../services/weatherService";

vi.mock("../../services/weatherService", () => ({
  WeatherService: {
    getWeather: vi.fn(),
  },
}));

describe("WeatherInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when no city is provided", () => {
    const wrapper = mount(WeatherInfo, {
      props: {
        city: undefined,
      },
    });

    expect(wrapper.find(".bg-white").exists()).toBe(false);
  });

  it("should display loading state while fetching weather", () => {
    (WeatherService.getWeather as any).mockImplementation(
      () => new Promise(() => {})
    );

    const wrapper = mount(WeatherInfo, {
      props: {
        city: "London",
      },
    });

    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("should display weather information when data is loaded", async () => {
    const mockWeatherData = {
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

    (WeatherService.getWeather as any).mockResolvedValue(mockWeatherData);

    const wrapper = mount(WeatherInfo, {
      props: {
        city: "London",
      },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".animate-spin").exists()).toBe(false);
    const text = wrapper.text();
    expect(text).toContain("clear sky");
    expect(text).toContain("20°C");
    expect(text).toContain("19°C");
    expect(text).toContain("65%");
    expect(text).toContain("1015 hPa");
    expect(text).toContain("5 m/s");
  });

  it("should display error message when weather fetch fails", async () => {
    (WeatherService.getWeather as any).mockRejectedValue(
      new Error("Failed to fetch weather")
    );

    const wrapper = mount(WeatherInfo, {
      props: {
        city: "InvalidCity",
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Failed to fetch weather");
  });

  it("should update weather when city changes", async () => {
    const mockWeatherData = {
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

    (WeatherService.getWeather as any).mockResolvedValue(mockWeatherData);

    const wrapper = mount(WeatherInfo, {
      props: {
        city: "London",
      },
    });

    await wrapper.vm.$nextTick();

    await wrapper.setProps({ city: "Paris" });
    await wrapper.vm.$nextTick();

    expect(WeatherService.getWeather).toHaveBeenCalledWith("Paris");
  });
});
