"use client"
import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"

import { Search } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Plus, LayoutDashboard, Package, Pencil, Trash2, ShoppingBag, Eye } from "lucide-react"

import { useManagementProducts } from './utils/UseManagementProducts'

import { useManagementProductsCategories } from '../categories/utils/UseManagementProductsCategories'

import { ProductDialog } from './components/ProductDialog'

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

import Image from 'next/image'

import { toast } from "sonner"

import ProductsSkelaton from './ProductsSkelaton'

import { Pagination } from "@/components/ui/pagination"

import { ViewModal } from './components/ViewModal'

export default function ProductsLayout() {
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
        handleDelete,
        currentPage,
        totalPages,
        handlePageChange,
        isSubmitting,
    } = useManagementProducts()

    const { items: categories } = useManagementProductsCategories()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [viewModalOpen, setViewModalOpen] = useState(false)

    const handleEdit = (product: any) => {
        setSelectedProduct(product)
        setDialogOpen(true)
    }

    const handleCreateClick = () => {
        setSelectedProduct(null)
        setDialogOpen(true)
    }

    const handleSubmit = async (data: any, imageFile?: File) => {
        try {
            if (selectedProduct) {
                await handleUpdate(data, imageFile)
            } else {
                await handleCreate(data, imageFile!)
            }
            setDialogOpen(false)
        } catch (error) {
            console.error('Error submitting product:', error)
            toast.error('Failed to save product')
        }
    }

    const handleView = (product: any) => {
        setSelectedProduct(product)
        setViewModalOpen(true)
    }

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
        const matchesSearch = searchQuery === "" ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.size && item.size.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesCategory && matchesSearch
    })

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <ShoppingBag
                            className="h-8 w-8 text-primary"
                        />
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h1>
                    </div>

                    <Breadcrumb className="hidden sm:flex">
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
                                    <Package className="h-4 w-4" />
                                    products
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <Button className="transition-all duration-200 hover:scale-105 w-full sm:w-auto" onClick={handleCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 mb-4">
                <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or size..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.title}>
                                {category.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border border-gray-100 rounded-2xl p-2 md:p-4">
                {isLoading ? (
                    <ProductsSkelaton />
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <Package
                            className="h-12 w-12 text-gray-400 mb-4"
                        />
                        <p className="text-lg font-medium text-gray-500">Tidak ada produk yang tersedia</p>
                        <p className="text-sm text-gray-400 mt-1">Silakan tambahkan produk baru</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                        {filteredItems.map((product) => (
                            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20">
                                <CardHeader className="p-0">
                                    <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            priority={false}
                                            quality={85}
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder-image.png';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        <div className="absolute bottom-3 left-3 flex gap-2">
                                            {product.category && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-primary shadow-sm">
                                                    {product.category}
                                                </span>
                                            )}

                                            {product.size && product.size !== "null" && product.size !== "NULL" && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                                                    {product.size}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors duration-300">{product.title}</CardTitle>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(Number(product.price) * 1000)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-4 w-4"
                                            >
                                                <path d="M20 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
                                                <path d="M8 2v4" />
                                                <path d="M16 2v4" />
                                                <path d="M2 10h20" />
                                            </svg>
                                            Stock: {product.stock || 0}
                                        </p>
                                        {product.ratings && (
                                            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="h-4 w-4 text-yellow-400"
                                                >
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                                {product.ratings}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleView(product)}
                                        className="hover:bg-primary/10 transition-colors duration-300"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(product)}
                                        className="hover:bg-primary hover:text-white transition-colors duration-300"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            if (product.id) {
                                                setItemToDelete(product.id)
                                                setDeleteDialogOpen(true)
                                            }
                                        }}
                                        className="hover:bg-destructive hover:text-white transition-colors duration-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <ProductDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedProduct}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => itemToDelete && handleDelete(itemToDelete)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ViewModal
                item={selectedProduct}
                isOpen={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false)
                    setSelectedProduct(null)
                }}
            />
        </section>
    )
}

