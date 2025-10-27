import { AboutData, ApiResponse } from "@/hooks/(pages)/about/types/about";

import {
  testimonialsData,
  ApiResponseTestimonials,
} from "@/hooks/(pages)/about/types/testimonials";

import { AppsData, ApiResponseApps } from "@/hooks/(pages)/about/types/apps";

export const fetchAboutContents = async (): Promise<AboutData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`, {
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
    console.error("Error fetching about data:", error);
    throw error;
  }
};

export const fetchTestimonialsContents = async (): Promise<
  testimonialsData[]
> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/testimonials`,
      {
        next: {
          revalidate: 50, // Revalidate every hour
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: ApiResponseTestimonials = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching testimonials data:", error);
    throw error;
  }
};

export const fetchAppsContents = async (): Promise<AppsData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps`, {
      next: {
        revalidate: 50, // Revalidate every hour
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: ApiResponseApps = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching testimonials data:", error);
    throw error;
  }
};
