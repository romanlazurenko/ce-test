<template>
  <div v-if="props.city" class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-semibold mb-4">City Gallery</h2>
    <div v-if="isLoading" class="flex justify-center items-center h-48">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
      ></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>
    <div v-else class="carousel-container">
      <Carousel
        :value="photos"
        :numVisible="3"
        :numScroll="1"
        :responsiveOptions="responsiveOptions"
        class="custom-carousel"
        circular
      >
        <template #item="slotProps">
          <div class="carousel-item flex justify-center items-center p-2">
            <div class="image-container w-full max-w-2xl aspect-[4/3] relative">
              <Image
                :src="slotProps.data.urls.regular"
                :alt="slotProps.data.alt_description || city"
                class="w-full h-full object-cover rounded-lg"
                preview
              />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Carousel from "primevue/carousel";
import Image from "primevue/image";
import { GalleryService, type Photo } from "../services/galleryService";

const props = defineProps<{
  city?: string;
}>();

const photos = ref<Photo[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 1,
    numScroll: 1,
  },
  {
    breakpoint: "576px",
    numVisible: 1,
    numScroll: 1,
  },
]);

async function fetchPhotos() {
  if (!props.city) {
    photos.value = [];
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    photos.value = await GalleryService.getCityPhotos(props.city);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load city photos";
    console.error("Error loading photos:", err);
    photos.value = [];
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.city, fetchPhotos, { immediate: true });
</script>

<style lang="scss">
.carousel-container {
  @apply max-w-full overflow-hidden;
}

.custom-carousel {
  .p-carousel-container {
    @apply pb-8;
  }

  .p-carousel-items-container {
    @apply overflow-visible;
  }

  .p-carousel-indicators {
    @apply bottom-0;
  }
}

.image-container {
  :deep(.p-image) {
    @apply block w-full h-full;

    img {
      @apply w-full h-full object-cover rounded-lg;
    }
  }

  :deep(.p-image-preview) {
    @apply bg-black bg-opacity-90;
  }

  :deep(.p-image-preview-indicator) {
    @apply text-white;
  }

  :deep(.p-image-preview-container) {
    img {
      @apply max-h-[90vh] max-w-[90vw] object-contain;
    }
  }
}
</style>
