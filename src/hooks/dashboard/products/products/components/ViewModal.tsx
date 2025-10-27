import React from 'react'

import Image from 'next/image'

import { format, isValid } from 'date-fns'

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"

import { Hash, AlignLeft, Calendar, Clock, DollarSign, Package, Star } from "lucide-react"

interface ViewModalProps {
    item: {
        id: string;
        title: string;
        content: string;
        thumbnail: string;
        price: number;
        category: string;
        size: string;
        stock: number;
        sold: string;
        description: string;
        ratings?: string | null;
        createdAt: string;
        updatedAt: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ViewModal({ item, isOpen, onClose }: ViewModalProps) {
    if (!item) return null;

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isValid(date)) {
                return format(date, 'PPpp');
            }
            return 'N/A';
        } catch (error) {
            return 'N/A';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-0 p-0">
                <DialogTitle className="sr-only">Product Details</DialogTitle>
                <div className="relative">
                    {/* Hero Image Section */}
                    <div className="relative w-full h-[300px] sm:h-[400px]">
                        <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className='flex gap-4 items-center'>
                                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{item.title}</h1>
                                <div>|</div>
                                <p className="text-lg text-gray-200">{item.category}</p>
                            </div>
                            <p className="text-lg text-gray-200 line-clamp-3">{item.description}</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="grid gap-8">
                            {/* Price, Size, Stock, and Ratings Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Price</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(Number(item.price) * 1000)}
                                    </p>
                                </div>

                                {item.size && item.size !== "null" && (
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Size</h3>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {item.size}
                                        </p>
                                    </div>
                                )}

                                {item.ratings && (
                                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 p-6 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Ratings</h3>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {item.ratings}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Stock</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {item.stock || 0}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Sold</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {item.sold || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30 p-6 rounded-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlignLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Details</h3>
                                </div>
                                <div
                                    className="text-gray-600 dark:text-gray-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            </div>

                            {/* Timestamps Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Created At</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {formatDate(item.createdAt)}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Updated At</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {formatDate(item.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 