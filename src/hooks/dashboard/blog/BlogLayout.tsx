"use client"

import React from 'react'

import { format } from 'date-fns'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { LayoutDashboard, FileText, Trash2, BookOpenText, Eye } from "lucide-react"

import { CreateModal } from '@/hooks/dashboard/blog/modal/CreateModal'

import { EditModal } from '@/hooks/dashboard/blog/modal/EditModal'

import { Button } from "@/components/ui/button"

import Image from 'next/image'

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


import BlogSkelaton from '@/hooks/dashboard/blog/BlogSkelaton'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

import { ViewModal } from '@/hooks/dashboard/blog/modal/ViewModal'

import { Pagination } from "@/components/ui/pagination"

import { useManagementBlog } from './utils/useManagementBlog'

export default function DailyLayout() {
    const {
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
    } = useManagementBlog();

    return (
        <section className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 pb-4">
                                <BookOpenText width={32} height={32} />
                                <h1 className="text-3xl font-bold tracking-tight">Daily</h1>
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
                                            <BookOpenText className="h-4 w-4" />
                                            Daily
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <CreateModal onSubmit={handleCreate} />
                    </div>
                </CardHeader>
            </Card>

            {isLoading ? (
                <BlogSkelaton />
            ) : items.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No items found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Get started by creating a new item using the button above.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                                <CardHeader className="space-y-4">
                                    <div className="aspect-video relative overflow-hidden rounded-lg">
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <CardTitle className="line-clamp-1 text-xl font-bold group-hover:text-primary transition-colors">
                                            {item.title}
                                        </CardTitle>

                                        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                                            {item.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <span className="font-medium">Slug:</span>
                                            <span className="text-primary">{item.slug}</span>
                                        </div>

                                        <div className="flex flex-col gap-1 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Created:</span>
                                                <span>{format(new Date(item.createdAt), 'PPpp')}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Updated:</span>
                                                <span>{format(new Date(item.updatedAt), 'PPpp')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setViewModalOpen(true);
                                        }}
                                        className="hover:scale-105 transition-transform"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <EditModal item={item} onSubmit={handleUpdate} />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => {
                                            setItemToDelete(item.id);
                                            setDeleteDialogOpen(true);
                                        }}
                                        className="hover:scale-105 transition-transform"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalItems / itemsPerPage)}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => itemToDelete && handleDelete(itemToDelete)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white cursor-pointer"
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

            <ViewModal
                item={selectedItem}
                isOpen={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedItem(null);
                }}
            />
        </section>
    )
}
