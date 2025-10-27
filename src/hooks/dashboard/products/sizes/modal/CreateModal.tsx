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

import { Plus, Loader2, Type } from "lucide-react"

interface CreateModalProps {
    onSubmit: (data: { title: string }) => Promise<void>;
}

export function CreateModal({ onSubmit }: CreateModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        title: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await onSubmit({
                title: formData.title
            })
            setOpen(false)
            setFormData({
                title: '',
            })
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
                    Create New Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-full md:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-none md:rounded-xl shadow-2xl border-0">
                <DialogHeader className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                        <DialogTitle className="text-xl sm:text-2xl font-bold">
                            Create New Category
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Add a new category to your collection. Fill in the details below.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:gap-6 py-4 px-0 md:px-6">
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
                    </div>
                    <DialogFooter className="border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Category'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 