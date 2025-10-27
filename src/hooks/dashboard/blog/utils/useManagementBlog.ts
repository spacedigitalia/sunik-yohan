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
} from "firebase/firestore";

import { db } from "@/utils/firebase/Firebase";

import imagekit from "@/utils/imagekit/imagekit";

import { slugify } from "@/base/helper/helpers";

import { toast } from "sonner";

import { BlogProps } from "@/hooks/dashboard/blog/types/blog";

export const useManagementBlog = () => {
  const [items, setItems] = useState<BlogProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BlogProps | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const fetchItems = async () => {
    try {
      const q = query(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_BLOG as string),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const allItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogProps[];

      setTotalItems(allItems.length);

      // Calculate pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = allItems.slice(startIndex, endIndex);

      setItems(paginatedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();

      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const result = await imagekit.upload({
        file: base64,
        fileName: `blog-${Date.now()}`,
        folder: "/blog",
      });

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleCreate = async (data: {
    title: string;
    description: string;
    thumbnail: File | null;
    content: string;
  }) => {
    try {
      if (!data.thumbnail) {
        toast.error("Please select a thumbnail image");
        return;
      }

      const now = new Date().toISOString();
      const slug = slugify(data.title);

      // Upload image to ImageKit
      const thumbnailUrl = await handleImageUpload(data.thumbnail);

      // Save data to Firestore
      const docRef = await addDoc(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_BLOG as string),
        {
          title: data.title,
          description: data.description,
          thumbnail: thumbnailUrl,
          content: data.content,
          slug: slug,
          createdAt: now,
          updatedAt: now,
        }
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Item created successfully");

      // Refresh the items list
      await fetchItems();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to create item");
    }
  };

  const handleUpdate = async (data: {
    id: string;
    title: string;
    description: string;
    thumbnail?: File | null;
    content: string;
  }) => {
    try {
      let thumbnailUrl = items.find((item) => item.id === data.id)?.thumbnail;

      // If new thumbnail is provided, upload it
      if (data.thumbnail) {
        thumbnailUrl = await handleImageUpload(data.thumbnail);
      }

      const slug = slugify(data.title);
      // Update data in Firestore
      await updateDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_BLOG as string, data.id),
        {
          title: data.title,
          description: data.description,
          thumbnail: thumbnailUrl,
          content: data.content,
          slug: slug,
          updatedAt: new Date().toISOString(),
        }
      );

      toast.success("Item updated successfully");
      await fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_BLOG as string, id)
      );
      toast.success("Item deleted successfully");
      await fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
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
    viewModalOpen,
    setViewModalOpen,
    selectedItem,
    setSelectedItem,
    currentPage,
    totalItems,
    itemsPerPage,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
