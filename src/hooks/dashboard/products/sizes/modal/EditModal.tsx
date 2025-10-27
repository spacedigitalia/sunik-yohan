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

import { Pencil, Loader2, Type } from "lucide-react"

import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
})

type FormValues = z.infer<typeof formSchema>

interface EditModalProps {
    item: {
        id: string;
        title: string;
    };
    onSubmit: (data: {
        id: string;
        title: string;
    }) => Promise<void>;
}

export function EditModal({ item, onSubmit }: EditModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: item.title,
        },
    })

    const handleSubmit = async (values: FormValues) => {
        try {
            setIsLoading(true)
            await onSubmit({
                id: item.id,
                ...values
            });
            setOpen(false);
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category");
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
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-none md:rounded-xl shadow-2xl border-0 p-0">
                <DialogHeader className="bg-white dark:bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="space-y-1 sm:space-y-2">
                        <DialogTitle className="text-lg sm:text-2xl font-bold">
                            Edit Category
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Make changes to your category here. Click save when you're done.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-4 sm:px-6 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                        <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter title"
                                            {...field}
                                            disabled={isLoading}
                                            className="text-sm sm:text-base h-9 sm:h-10 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all duration-200"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs sm:text-sm" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 mt-4 sm:mt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base transition-all duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 