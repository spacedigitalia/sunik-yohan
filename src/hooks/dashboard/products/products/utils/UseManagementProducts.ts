import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/utils/firebase/Firebase";
import { toast } from "sonner";
import imagekitInstance from "@/utils/imagekit/imagekit";
import { useManagementProductsCategories } from "../../categories/utils/UseManagementProductsCategories";
import { useManagementProductsSizes } from "../../sizes/utils/UseManagementProductsSizes";

interface Product {
  id?: string;
  title: string;
  slug: string;
  price: string;
  shopeUrl: string;
  thumbnail: string;
  category: string;
  stock: string;
  size: string;
  content: string;
  ratings?: string | null;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const ITEMS_PER_PAGE = 8;

export const useManagementProducts = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [lastVisibleDocs, setLastVisibleDocs] = useState<any[]>([]);

  const { items: categories } = useManagementProductsCategories();
  const { items: sizes } = useManagementProductsSizes();

  const fetchItems = async (page: number = 1) => {
    try {
      setIsLoading(true);
      let q;

      if (page === 1) {
        q = query(
          collection(
            db,
            process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string
          ),
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE)
        );
      } else if (page > currentPage) {
        // Going forward
        q = query(
          collection(
            db,
            process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string
          ),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        // Going backward
        const prevPageLastVisible = lastVisibleDocs[page - 2];
        q = query(
          collection(
            db,
            process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string
          ),
          orderBy("createdAt", "desc"),
          startAfter(prevPageLastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setItems(fetchedItems);

      // Store the last visible document for this page
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      // Update the array of last visible documents
      const newLastVisibleDocs = [...lastVisibleDocs];
      newLastVisibleDocs[page - 1] = lastVisibleDoc;
      setLastVisibleDocs(newLastVisibleDocs);

      setHasNextPage(querySnapshot.docs.length === ITEMS_PER_PAGE);

      const totalItemsQuery = query(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string)
      );
      const totalItemsSnapshot = await getDocs(totalItemsQuery);
      const totalItems = totalItemsSnapshot.size;
      setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const reader = new FileReader();

      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const result = await imagekitInstance.upload({
        file: base64,
        fileName: `product-${Date.now()}`,
        folder: "/products",
      });

      if (!result || !result.url) {
        throw new Error("Failed to upload image");
      }

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleCreate = async (
    data: Omit<Product, "id" | "createdAt">,
    imageFile: File
  ) => {
    try {
      setIsSubmitting(true);
      const thumbnailUrl = await uploadImage(imageFile);

      // Get category and size titles
      const categoryTitle =
        categories.find((cat) => cat.id === data.category)?.title ||
        data.category;
      const sizeTitle =
        sizes.find((s) => s.id === data.size)?.title || data.size;

      const docRef = await addDoc(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string),
        {
          ...data,
          category: categoryTitle,
          size: sizeTitle,
          thumbnail: thumbnailUrl,
          ratings: data.ratings || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      toast.success("Product created successfully");
      await fetchItems(currentPage);
    } catch (e) {
      console.error("Error adding product:", e);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Product, imageFile?: File) => {
    try {
      setIsSubmitting(true);
      let updateData = { ...data };

      if (imageFile) {
        const thumbnailUrl = await uploadImage(imageFile);
        updateData.thumbnail = thumbnailUrl;
      }

      // Get category and size titles
      const categoryTitle =
        categories.find((cat) => cat.id === data.category)?.title ||
        data.category;
      const sizeTitle =
        sizes.find((s) => s.id === data.size)?.title || data.size;

      updateData.category = categoryTitle;
      updateData.size = sizeTitle;
      updateData.ratings = data.ratings || null;
      updateData.updatedAt = new Date().toISOString();

      await updateDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string,
          data.id!
        ),
        updateData
      );

      toast.success("Product updated successfully");
      await fetchItems(currentPage);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string, id)
      );
      toast.success("Product deleted successfully");
      await fetchItems(currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setIsDeleting(false);
    }
  };

  return {
    items,
    isLoading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    setItemToDelete,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleDelete,
    currentPage,
    totalPages,
    handlePageChange,
    hasNextPage,
    isSubmitting,
  };
};
