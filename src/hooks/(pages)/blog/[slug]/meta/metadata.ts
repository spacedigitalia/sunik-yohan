import { Metadata } from "next";

import { db } from "@/utils/firebase/Firebase";

import { collection, getDocs, query, where } from "firebase/firestore";

export interface Blog {
  title: string;
  thumbnail: string[];
  description: string;
  slug: string;
}

export async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const blogRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_BLOG as string
    );
    const q = query(blogRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const blogData = querySnapshot.docs[0].data() as Blog;
    return blogData;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  return {
    title: blog
      ? `Blog - ${blog.title} | Sunik Yohan`
      : "Blog Tidak Ditemukan | Sunik Yohan",
    description: blog ? blog.description : "Blog tidak ditemukan",
    keywords: "blog, artikel, Sunik Yohan",
    openGraph: {
      title: blog
        ? `Blog - ${blog.title} | Sunik Yohan`
        : "Blog Tidak Ditemukan | Sunik Yohan",
      description: blog ? blog.description : "Blog tidak ditemukan",
      type: "article",
      locale: "id_ID",
      siteName: "Sunik Yohan",
      images: blog?.thumbnail ? [blog.thumbnail[0]] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog
        ? `Blog - ${blog.title} | Sunik Yohan`
        : "Blog Tidak Ditemukan | Sunik Yohan",
      description: blog ? blog.description : "Blog tidak ditemukan",
      images: blog?.thumbnail ? [blog.thumbnail[0]] : [],
    },
  };
}
