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

import ServiceSkelaton from '@/hooks/dashboard/pages/services/ServicesSkelaton'

import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

import { useManagementServices } from '@/hooks/dashboard/pages/services/utils/UseManagementServices'

export default function HomeLayout() {
    const {
        items,
        isLoading,
        deleteDialogOpen,
        setDeleteDialogOpen,
        itemToDelete,
        setItemToDelete,
        isDeleting,
        handleCreate,
        handleUpdate,
        handleDelete
    } = useManagementServices();

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4 overflow-hidden">
                <div className="space-y-1 w-full sm:w-auto">
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
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Services</h1>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList className="flex flex-wrap">
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 capitalize">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="hidden sm:inline">dashboard</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/pages" className="flex items-center gap-1 capitalize">
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">pages</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Home className="h-4 w-4" />
                                    <span className="hidden sm:inline">services</span>
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                    <CreateModal onSubmit={handleCreate} />
                </div>
            </div>

            {isLoading ? (
                <ServiceSkelaton />
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No services found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get started by creating a new service using the button above.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="line-clamp-1 text-base sm:text-lg">{item.title}</CardTitle>
                                <CardDescription className="line-clamp-2 text-sm sm:text-base">
                                    {item.description}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                                <EditModal item={item} onSubmit={handleUpdate} />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                        setItemToDelete(item.id);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service.
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
