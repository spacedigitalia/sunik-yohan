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

import { LayoutDashboard, FileText, Home, Trash2 } from "lucide-react"

import { CreateModal } from './modal/CreateModal'

import { EditModal } from './modal/EditModal'

import { db } from '@/utils/firebase/Firebase'

import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import imagekit from '@/utils/imagekit/imagekit'

import { Card, CardDescription, CardTitle } from "@/components/ui/card"

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

import TestimonialsSkelaton from '@/hooks/dashboard/testimonials/TestimonialsSkelaton'

import { testimonialsPropes } from "@/hooks/dashboard/testimonials/types/testimonials"

import { Pagination } from "@/components/ui/pagination"

export default function HomeLayout() {
    const [items, setItems] = React.useState<testimonialsPropes[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 6;

    const fetchItems = async () => {
        try {
            const q = query(
                collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_TESTIMONIALS as string),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const fetchedItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as testimonialsPropes[];
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
                fileName: `testimonials-${Date.now()}`,
                folder: "/testimonials",
            });

            return result.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleCreate = async (data: {
        name: string;
        job: string;
        message: string;
        image: File;
    }) => {
        try {
            // Upload image to ImageKit
            const imageUrl = await handleImageUpload(data.image);

            // Save data to Firestore
            const docRef = await addDoc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_TESTIMONIALS as string), {
                name: data.name,
                job: data.job,
                message: data.message,
                imageUrl: imageUrl,
                createdAt: new Date().toISOString()
            });
            console.log("Document written with ID: ", docRef.id);
            toast.success("Testimonial created successfully");

            // Refresh the items list
            await fetchItems();
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Failed to create testimonial");
        }
    };

    const handleUpdate = async (data: {
        id: string;
        name: string;
        job: string;
        message: string;
        image?: File;
    }) => {
        try {
            let imageUrl = items.find(item => item.id === data.id)?.imageUrl;

            // If new image is provided, upload it
            if (data.image) {
                imageUrl = await handleImageUpload(data.image);
            }

            // Update data in Firestore
            await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_TESTIMONIALS as string, data.id), {
                name: data.name,
                job: data.job,
                message: data.message,
                imageUrl: imageUrl,
            });

            toast.success("Testimonial updated successfully");
            await fetchItems();
        } catch (error) {
            console.error("Error updating testimonial:", error);
            toast.error("Failed to update testimonial");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_TESTIMONIALS as string, id));
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

    const paginatedItems = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, currentPage]);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary"
                        >
                            <path
                                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9 22V12H15V22"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
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
                                <BreadcrumbLink href="/dashboard/pages" className="flex items-center gap-1 capitalize">
                                    <FileText className="h-4 w-4" />
                                    pages
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Home className="h-4 w-4" />
                                    testimonials
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <CreateModal onSubmit={handleCreate} />
            </div>

            {isLoading ? (
                <TestimonialsSkelaton />
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No testimonials found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get started by creating a new testimonial using the button above.
                    </p>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col">
                                    <div className="aspect-video relative group overflow-hidden">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
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
                                    <div className="flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50">
                                        <div className="space-y-3">
                                            <CardTitle className="text-md font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                                {item.name}
                                            </CardTitle>

                                            <div className='flex gap-2'>
                                                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                                    {item.job}
                                                </CardTitle>
                                            </div>

                                            <CardDescription className="text-sm text-gray-600 leading-relaxed">
                                                {item.message}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the testimonial.
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
