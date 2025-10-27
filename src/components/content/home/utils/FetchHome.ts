import { HomeData, ApiResponse } from "@/components/content/home/types/home";

export const fetchHomeData = async (): Promise<HomeData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
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
    console.error("Error fetching home data:", error);
    throw error;
  }
};
