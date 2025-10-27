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

import { Pencil, Loader2, Image as ImageIcon, Link, Type, FileText } from "lucide-react"

import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    text: z.string().min(2, {
        message: "Text must be at least 2 characters.",
    }),
    span: z.string().min(2, {
        message: "Span must be at least 2 characters.",
    }),
    image: z.instanceof(File).optional(),
    button: z.object({
        label: z.string().min(2, {
            message: "Button label must be at least 2 characters.",
        }),
        href: z.string().url({
            message: "Please enter a valid URL.",
        }),
    }),
})

interface EditModalProps {
    item: {
        id: string;
        title: string;
        description: string;
        text: string;
        span: string;
        imageUrl: string;
        button: {
            label: string;
            href: string;
        };
    };
    onSubmit: (data: {
        id: string;
        title: string;
        description: string;
        text: string;
        span: string;
        image?: File;
        button: {
            label: string;
            href: string;
        }
    }) => Promise<void>;
}

export function EditModal({ item, onSubmit }: EditModalProps) {
    const [open, setOpen] = React.useState(false)
    const [imagePreview, setImagePreview] = React.useState<string>(item.imageUrl)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: item.title,
            description: item.description,
            text: item.text,
            span: item.span,
            button: item.button,
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("image", file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
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
            form.setValue("image", file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

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
                <DialogHeader className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                        <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Edit Item
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Make changes to your item here. Click save when you're done.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6 px-0 md:px-6 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        <Type className="h-4 w-4" />
                                        Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter title"
                                            {...field}
                                            disabled={isLoading}
                                            className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                            <Type className="h-4 w-4" />
                                            Text
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter text"
                                                {...field}
                                                disabled={isLoading}
                                                className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="span"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                            <Type className="h-4 w-4" />
                                            Span
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter span"
                                                {...field}
                                                disabled={isLoading}
                                                className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        <FileText className="h-4 w-4" />
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter description"
                                            {...field}
                                            disabled={isLoading}
                                            className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="button.label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                            <Type className="h-4 w-4" />
                                            Button Label
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter button label"
                                                {...field}
                                                disabled={isLoading}
                                                className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="button.href"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                            <Link className="h-4 w-4" />
                                            Button URL
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter button URL"
                                                {...field}
                                                disabled={isLoading}
                                                className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        <ImageIcon className="h-4 w-4" />
                                        Image
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {!imagePreview ? (
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        disabled={isLoading}
                                                        id="image-upload"
                                                        {...field}
                                                    />
                                                    <label
                                                        htmlFor="image-upload"
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
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            form.setValue("image", undefined);
                                                            setImagePreview('');
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="bg-white dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700 px-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm sm:text-base"
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