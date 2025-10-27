import {
  ProductsData,
  ApiResponse,
} from "@/components/content/products/types/products";

export interface ProductCategory {
  id: string;
  title: string;
}

export const fetchProductsData = async (): Promise<ProductsData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
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

export const fetchProductsDataBySlug = async (
  slug: string
): Promise<ProductsData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
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
