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
import { toast } from "sonner";
import { servicesPropes } from "../types/services";

export const useManagementServices = () => {
  const [items, setItems] = useState<servicesPropes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const q = query(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as servicesPropes[];
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
        fileName: `services-${Date.now()}`,
        folder: "/services",
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
    image: File;
  }) => {
    try {
      const imageUrl = await handleImageUpload(data.image);

      const docRef = await addDoc(
        collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string),
        {
          title: data.title,
          description: data.description,
          imageUrl: imageUrl,
          createdAt: new Date().toISOString(),
        }
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Service created successfully");

      await fetchItems();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to create service");
    }
  };

  const handleUpdate = async (data: {
    id: string;
    title: string;
    description: string;
    image?: File;
  }) => {
    try {
      let imageUrl = items.find((item) => item.id === data.id)?.imageUrl;

      if (data.image) {
        imageUrl = await handleImageUpload(data.image);
      }

      await updateDoc(
        doc(
          db,
          process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string,
          data.id
        ),
        {
          title: data.title,
          description: data.description,
          imageUrl: imageUrl,
        }
      );

      toast.success("Service updated successfully");
      await fetchItems();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteDoc(
        doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string, id)
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
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};
