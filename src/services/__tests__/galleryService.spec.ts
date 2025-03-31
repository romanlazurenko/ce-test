import { GalleryService } from "../galleryService";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../utils/unsplash", () => ({
  getCityPhotos: vi.fn(),
}));

describe("GalleryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCityPhotos", () => {
    it("should fetch photos successfully", async () => {
      const mockPhotos = [
        {
          id: "1",
          urls: {
            regular: "https://example.com/photo1.jpg",
            raw: "https://example.com/photo1-raw.jpg",
          },
          alt_description: "City photo 1",
        },
        {
          id: "2",
          urls: {
            regular: "https://example.com/photo2.jpg",
            raw: "https://example.com/photo2-raw.jpg",
          },
          alt_description: "City photo 2",
        },
      ];

      const { getCityPhotos } = await import("../../utils/unsplash");
      (getCityPhotos as any).mockResolvedValue(mockPhotos);

      const result = await GalleryService.getCityPhotos("London");

      expect(result).toEqual(mockPhotos);
      expect(getCityPhotos).toHaveBeenCalledWith("London");
    });

    it("should handle API errors", async () => {
      const { getCityPhotos } = await import("../../utils/unsplash");
      (getCityPhotos as any).mockRejectedValue(
        new Error("Failed to fetch photos")
      );

      await expect(GalleryService.getCityPhotos("London")).rejects.toThrow(
        "Failed to fetch photos"
      );
    });

    it("should handle network errors", async () => {
      const { getCityPhotos } = await import("../../utils/unsplash");
      (getCityPhotos as any).mockRejectedValue(new Error("Network error"));

      await expect(GalleryService.getCityPhotos("London")).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle empty responses", async () => {
      const { getCityPhotos } = await import("../../utils/unsplash");
      (getCityPhotos as any).mockResolvedValue([]);

      const result = await GalleryService.getCityPhotos("London");
      expect(result).toEqual([]);
    });
  });
});
