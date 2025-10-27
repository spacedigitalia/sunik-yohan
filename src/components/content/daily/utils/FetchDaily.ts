import {
  DailySchedule,
  ApiResponse,
} from "@/components/content/daily/types/daily";

export const fetchDailyData = async (): Promise<DailySchedule[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/home/daily`,
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
    console.error("Error fetching daily data:", error);
    throw error;
  }
};
