import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CityGallery from "../CityGallery.vue";
import { GalleryService } from "../../services/galleryService";

vi.mock("../../services/galleryService", () => ({
  GalleryService: {
    getCityPhotos: vi.fn(),
  },
}));

describe("CityGallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when no city is provided", () => {
    const wrapper = mount(CityGallery, {
      props: {
        city: undefined,
      },
    });

    expect(wrapper.find(".bg-white").exists()).toBe(false);
  });

  it("should show loading state while fetching photos", () => {
    const wrapper = mount(CityGallery, {
      props: {
        city: "London",
      },
    });

    expect(wrapper.find(".animate-spin").exists()).toBe(true);
  });

  it("should display error message when photo fetch fails", async () => {
    const errorMessage = "Failed to fetch photos";
    (GalleryService.getCityPhotos as any).mockRejectedValue(
      new Error(errorMessage)
    );

    const wrapper = mount(CityGallery, {
      props: {
        city: "London",
      },
    });

    await wrapper.vm.$nextTick();

    const errorElement = wrapper.find(".text-red-500");
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toBe(errorMessage);
  });

  it("should update photos when city prop changes", async () => {
    const wrapper = mount(CityGallery, {
      props: {
        city: "London",
      },
    });

    await wrapper.vm.$nextTick();

    await wrapper.setProps({ city: "Paris" });

    await wrapper.vm.$nextTick();

    expect(GalleryService.getCityPhotos).toHaveBeenCalledTimes(2);
    expect(GalleryService.getCityPhotos).toHaveBeenLastCalledWith("Paris");
  });
});
