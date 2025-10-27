import {
  GalleryData,
  ApiResponse,
} from "@/hooks/(pages)/gallery/types/gallery";

export const fetchGalleryData = async (): Promise<GalleryData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
      next: {
        revalidate: 50, // Revalidate every hour
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    throw error;
  }
};
