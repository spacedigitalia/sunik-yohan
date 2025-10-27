import React from 'react'

import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"

import { Plus, Loader2, Type, Image as ImageIcon, FileText, AlignLeft, Hash } from "lucide-react"

import { slugify } from '@/base/helper/helpers'

import QuillEditor from '@/base/helper/QuilEditor'

interface CreateModalProps {
    onSubmit: (data: {
        title: string;
        description: string;
        thumbnail: File | null;
        content: string;
    }) => Promise<void>;
}

export function CreateModal({ onSubmit }: CreateModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        thumbnail: null as File | null,
        content: ''
    })

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, title: e.target.value });
    };

    const handleImageChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setFormData({ ...formData, thumbnail: file });
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageChange(file);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageChange(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await onSubmit(formData)
            setOpen(false)
            setFormData({
                title: '',
                description: '',
                thumbnail: null,
                content: ''
            })
            setPreviewUrl(null)
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl max-h-full md:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-none md:rounded-xl shadow-2xl border-0">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create New Blog Post</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Add a new blog post to your collection. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-6">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                    <Type className="h-4 w-4 text-blue-600" />
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                    disabled={isLoading}
                                    className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                    <Hash className="h-4 w-4 text-blue-600" />
                                    Slug
                                </Label>
                                <Input
                                    id="slug"
                                    value={slugify(formData.title)}
                                    readOnly
                                    disabled={isLoading}
                                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <AlignLeft className="h-4 w-4 text-blue-600" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                disabled={isLoading}
                                placeholder="Enter a brief description of your blog post"
                                className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <ImageIcon className="h-4 w-4 text-blue-600" />
                                Thumbnail Image
                            </Label>
                            <div className="space-y-4">
                                {!previewUrl ? (
                                    <div className="relative">
                                        <Input
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="hidden"
                                            required
                                            disabled={isLoading}
                                        />
                                        <label
                                            htmlFor="thumbnail"
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`flex flex-col items-center justify-center w-full h-32 sm:h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${isDragging
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                                <ImageIcon className={`w-8 h-8 sm:w-10 sm:h-10 mb-3 transition-colors duration-200 ${isDragging ? 'text-blue-500' : 'text-gray-400'
                                                    }`} />
                                                <p className="mb-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                                    PNG, JPG or GIF (MAX. 800x400px)
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-[200px] sm:h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl group">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <FileText className="h-4 w-4 text-blue-600" />
                                Content
                            </Label>
                            <QuillEditor
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Enter the content of your blog post"
                                className="border-gray-300 dark:border-gray-700"
                                height="400px"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Blog Post'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 