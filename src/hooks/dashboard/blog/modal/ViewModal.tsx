import React from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import { BlogProps } from '../types/blog'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Type, Hash, AlignLeft, FileText, Calendar, Clock } from "lucide-react"

interface ViewModalProps {
    item: BlogProps | null
    isOpen: boolean
    onClose: () => void
}

export function ViewModal({ item, isOpen, onClose }: ViewModalProps) {
    if (!item) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-full md:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-none md:rounded-xl shadow-2xl border-0">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">View Blog Post</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        View the details of your blog post.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <Type className="h-4 w-4 text-blue-600" />
                                Title
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                {item.title}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <Hash className="h-4 w-4 text-blue-600" />
                                Slug
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                {item.slug}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                            <AlignLeft className="h-4 w-4 text-blue-600" />
                            Description
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                            {item.description}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                            <FileText className="h-4 w-4 text-blue-600" />
                            Thumbnail
                        </div>
                        <div className="relative w-full h-[200px] sm:h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                            <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <FileText className="h-4 w-4 text-blue-600" />
                            Content
                        </div>
                        <div
                            className="prose"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                Created At
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                {format(new Date(item.createdAt), 'PPpp')}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <Clock className="h-4 w-4 text-blue-600" />
                                Updated At
                            </div>
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                {format(new Date(item.updatedAt), 'PPpp')}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
