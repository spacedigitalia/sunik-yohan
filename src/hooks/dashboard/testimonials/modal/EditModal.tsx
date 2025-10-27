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

import { Label } from "@/components/ui/label"

import { Pencil, Loader2, Image as ImageIcon, Type, FileText } from "lucide-react"

import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    job: z.string().min(2, {
        message: "Job title must be at least 2 characters.",
    }),
    message: z.string().min(2, {
        message: "Message must be at least 2 characters.",
    }),
    image: z.instanceof(File).optional(),
})

interface EditModalProps {
    item: {
        id: string;
        name: string;
        job: string;
        message: string;
        imageUrl: string;
    };
    onSubmit: (data: {
        id: string;
        name: string;
        job: string;
        message: string;
        image?: File;
    }) => Promise<void>;
}

export function EditModal({ item, onSubmit }: EditModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [imagePreview, setImagePreview] = React.useState(item.imageUrl)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: item.name,
            job: item.job,
            message: item.message,
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("image", file)
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        }
    }

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            await onSubmit({
                id: item.id,
                ...values
            })
            setOpen(false)
        } catch (error) {
            console.error("Error updating item:", error)
            toast.error("Failed to update item")
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
                            Edit Testimonial
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Make changes to your testimonial here. Click save when you're done.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6 px-0 md:px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                            <Type className="h-4 w-4" />
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter name"
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
                                name="job"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                            <FileText className="h-4 w-4" />
                                            Job Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter job title"
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
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        <FileText className="h-4 w-4" />
                                        Message
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter message"
                                            {...field}
                                            disabled={isLoading}
                                            className="text-sm sm:text-base border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="image" className="flex items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                <ImageIcon className="h-4 w-4" />
                                Image
                            </Label>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    <Label
                                        htmlFor="image"
                                        className="flex flex-col items-center justify-center w-full h-[200px] sm:h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG or WEBP (MAX. 800x400px)
                                            </p>
                                        </div>
                                    </Label>
                                </div>
                                <div className="relative w-full h-[200px] sm:h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
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
            </DialogContent>
        </Dialog>
    )
} 