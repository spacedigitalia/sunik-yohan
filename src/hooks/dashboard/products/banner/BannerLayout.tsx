"use client"

import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { LayoutDashboard, FileText, Image, Trash2 } from "lucide-react"

import { CreateModal } from './modal/CreateModal'

import { EditModal } from './modal/EditModal'

import { db } from '@/utils/firebase/Firebase'

import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import imagekit from '@/utils/imagekit/imagekit'

import { Card } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"

import BannerSkelaton from './BannerSkelaton'

import { bannerPropes } from "./types/banner"

export default function BannerLayout() {
    const [items, setItems] = React.useState<bannerPropes[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const fetchItems = async () => {
        try {
            const q = query(
                collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_BANNER as string),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const fetchedItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as bannerPropes[];
            setItems(fetchedItems);
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to fetch items");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
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
                fileName: `banner-${Date.now()}`,
                folder: "/banner",
            });

            return result.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleCreate = async (data: { image: File }) => {
        try {
            const imageUrl = await handleImageUpload(data.image);
            const docRef = await addDoc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_BANNER as string), {
                imageUrl: imageUrl,
                createdAt: new Date().toISOString()
            });
            console.log("Document written with ID: ", docRef.id);
            toast.success("Banner created successfully");
            await fetchItems();
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Failed to create banner");
        }
    };

    const handleUpdate = async (data: { id: string; image: File }) => {
        try {
            const imageUrl = await handleImageUpload(data.image);
            await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_BANNER as string, data.id), {
                imageUrl: imageUrl,
            });
            toast.success("Banner updated successfully");
            await fetchItems();
        } catch (error) {
            console.error("Error updating banner:", error);
            toast.error("Failed to update banner");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_BANNER as string, id));
            toast.success("Banner deleted successfully");
            await fetchItems();
        } catch (error) {
            console.error("Error deleting banner:", error);
            toast.error("Failed to delete banner");
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
            setIsDeleting(false);
        }
    };

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <Image className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">Banner</h1>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 capitalize">
                                    <LayoutDashboard className="h-4 w-4" />
                                    dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/products" className="flex items-center gap-1 capitalize">
                                    <FileText className="h-4 w-4" />
                                    products
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Image className="h-4 w-4" />
                                    banner
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <CreateModal onSubmit={handleCreate} />
            </div>

            {isLoading ? (
                <BannerSkelaton />
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No banners found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get started by creating a new banner using the button above.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="aspect-video relative group">
                                <img
                                    src={item.imageUrl}
                                    alt="Banner"
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                                    <EditModal item={item} onSubmit={handleUpdate} />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                        onClick={() => {
                                            setItemToDelete(item.id);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the banner.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => itemToDelete && handleDelete(itemToDelete)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Deleting...
                                </div>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    )
}
