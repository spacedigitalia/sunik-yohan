import { Metadata } from "next";

import { db } from "@/utils/firebase/Firebase";

import { collection, getDocs, query, where } from "firebase/firestore";

export interface Products {
  title: string;
  thumbnail: string[];
  description: string;
  slug: string;
}

export async function getProducts(slug: string): Promise<Products | null> {
  try {
    const productsRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string
    );
    const q = query(productsRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const productsData = querySnapshot.docs[0].data() as Products;
    return productsData;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const products = await getProducts(params.slug);

  return {
    title: products ? `Products - ${products.title}` : "Products Not Found",

    openGraph: {
      title: products ? `Products - ${products.title}` : "Products Not Found",
      description: products
        ? `Products - ${products.description}`
        : "Products Not Found",
      images: products?.thumbnail ? [products.thumbnail[0]] : [],
    },
  };
}
