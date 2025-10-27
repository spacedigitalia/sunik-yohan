"use client"

import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from "react-hook-form"

import * as z from "zod"

import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

import { Pencil, Loader2, Type, Image as ImageIcon, FileText, AlignLeft, Hash } from "lucide-react"

import { toast } from "sonner"

import { slugify } from '@/base/helper/helpers'

import QuillEditor from '@/base/helper/QuilEditor'

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    thumbnail: z.instanceof(File).nullable().optional(),
    content: z.string().min(50, {
        message: "Content must be at least 50 characters.",
    }),
})

interface EditModalProps {
    item: {
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        content: string;
    };
    onSubmit: (data: {
        id: string;
        title: string;
        description: string;
        thumbnail?: File | null;
        content: string;
    }) => Promise<void>;
}

export function EditModal({ item, onSubmit }: EditModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(item.thumbnail)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: item.title,
            description: item.description,
            thumbnail: null,
            content: item.content,
        },
    })

    const handleImageChange = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            form.setValue('thumbnail', file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDeleteImage = () => {
        form.setValue('thumbnail', null);
        setPreviewUrl(null);
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

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            await onSubmit({
                id: item.id,
                ...values
            });
            setOpen(false);
        } catch (error) {
            console.error("Error updating item:", error);
            toast.error("Failed to update item");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="icon" className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl max-h-full md:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-none md:rounded-xl shadow-2xl border-0">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Edit Blog Post</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Make changes to your blog post here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                            <Type className="h-4 w-4 text-blue-600" />
                                            Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter title"
                                                {...field}
                                                disabled={isLoading}
                                                className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                    <Hash className="h-4 w-4 text-blue-600" />
                                    Slug
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        value={slugify(form.watch("title"))}
                                        readOnly
                                        disabled={isLoading}
                                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    />
                                </FormControl>
                            </FormItem>
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                        <AlignLeft className="h-4 w-4 text-blue-600" />
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter description"
                                            {...field}
                                            disabled={isLoading}
                                            className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                        <ImageIcon className="h-4 w-4 text-blue-600" />
                                        Thumbnail Image
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {!previewUrl ? (
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileInput}
                                                        className="hidden"
                                                        {...field}
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
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteImage}
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        Content
                                    </FormLabel>
                                    <FormControl>
                                        <QuillEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Enter content"
                                            className="border-gray-300 dark:border-gray-700"
                                            height="400px"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 