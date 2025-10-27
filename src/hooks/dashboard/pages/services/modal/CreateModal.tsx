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

import { Label } from "@/components/ui/label"

import { Plus, Loader2, Image as ImageIcon, Type, FileText } from "lucide-react"

interface CreateModalProps {
    onSubmit: (data: {
        title: string;
        description: string;
        image: File;
    }) => Promise<void>;
}

export function CreateModal({ onSubmit }: CreateModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        image: null as File | null,
    })
    const [previewUrl, setPreviewUrl] = React.useState<string>('')

    const handleImageChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setFormData({ ...formData, image: file })
            // Create preview URL
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleImageChange(file)
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageChange(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.image) {
            try {
                setIsLoading(true)
                await onSubmit({
                    ...formData,
                    image: formData.image
                })
                setOpen(false)
                setFormData({
                    title: '',
                    description: '',
                    image: null,
                })
                setPreviewUrl('')
            } catch (error) {
                console.error('Error submitting form:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Service
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-full md:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-none md:rounded-xl shadow-2xl border-0">
                <DialogHeader className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                        <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Create New Service
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Add a new service to your collection. Fill in the details below.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 py-4 px-0 md:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    <Type className="h-4 w-4" />
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    disabled={isLoading}
                                    className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    <FileText className="h-4 w-4" />
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    disabled={isLoading}
                                    className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image" className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                <ImageIcon className="h-4 w-4" />
                                Image
                            </Label>
                            <div className="space-y-4">
                                {!previewUrl ? (
                                    <div className="relative">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="hidden"
                                            required
                                            disabled={isLoading}
                                        />
                                        <label
                                            htmlFor="image"
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
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, image: null });
                                                setPreviewUrl('');
                                            }}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="bg-white dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700 px-6">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Service'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 