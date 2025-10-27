import {
  BannerData,
  ApiResponse,
} from "@/hooks/(pages)/products/banner/types/banner";

export const fetchBannerData = async (): Promise<BannerData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner`, {
      next: {
        revalidate: 50,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching banner data:", error);
    throw error;
  }
};
