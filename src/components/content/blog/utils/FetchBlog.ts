import { BlogData, ApiResponse } from "@/components/content/blog/types/blog";

export const fetchBlogData = async (): Promise<BlogData[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
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
    console.error("Error fetching blog data:", error);
    throw error;
  }
};

export const fetchBlogDataBySlug = async (
  slug: string
): Promise<BlogData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`,
      {
        next: {
          revalidate: 50,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching products data:", error);
    throw error;
  }
};
