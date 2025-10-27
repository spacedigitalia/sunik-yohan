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

import { ProductsSizesPropes } from "../types/sizes";

const ITEMS_PER_PAGE = 10;

export const useManagementProductsSizes = () => {
  const [items, setItems] = useState<ProductsSizesPropes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchItems = async (page: number = 1) => {
    try {
      setIsLoading(true);
      let q;

      if (page === 1) {
        q = query(
          collection(
            db,
            process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS_SIZES as string
          ),
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        q = query(
          collection(
            db,
            process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS_SIZES as string
          ),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductsSizesPropes[];

      setItems(fetchedItems);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasNextPage(querySnapshot.docs.length === ITEMS_PER_PAGE);

      // Calculate total pages
      const totalItemsQuery = query(
        collection(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS_SIZES as string
        )
      );
      const totalItemsSnapshot = await getDocs(totalItemsQuery);
      const totalItems = totalItemsSnapshot.size;
      setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items");
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

  const handleCreate = async (data: { title: string }) => {
    try {
      const docRef = await addDoc(
        collection(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS_SIZES as string
        ),
        {
          title: data.title,
          createdAt: new Date().toISOString(),
        }
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Service created successfully");

      await fetchItems(currentPage);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to create service");
    }
  };

  const handleUpdate = async (data: { id: string; title: string }) => {
    try {
      await updateDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS_SIZES as string,
          data.id
        ),
        {
          title: data.title,
        }
      );

      toast.success("Service updated successfully");
      await fetchItems(currentPage);
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS_SIZES as string,
          id
        )
      );
      toast.success("Item deleted successfully");
      await fetchItems(currentPage);
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
    handleCreate,
    handleUpdate,
    handleDelete,
    currentPage,
    totalPages,
    handlePageChange,
    hasNextPage,
  };
};
