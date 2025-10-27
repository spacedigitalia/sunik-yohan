import {
  ServicesData,
  ApiResponse,
} from "@/components/content/services/types/services";

export const fetchServicesData = async (): Promise<ServicesData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/home/services`,
      {
        next: {
          revalidate: 50, // Revalidate every hour
        },
      }
    );

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
