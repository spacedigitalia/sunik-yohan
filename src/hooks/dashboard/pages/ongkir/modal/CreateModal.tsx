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

import { Plus, Loader2, Type, Clock } from "lucide-react"

import { formatPrice } from '@/base/helper/price'

interface CreateModalProps {
    onSubmit: (data: {
        desa: string;
        price: string;
    }) => Promise<void>;
}

export function CreateModal({ onSubmit }: CreateModalProps) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        desa: '',
        price: ''
    })

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData({ ...formData, price: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await onSubmit(formData)
            setOpen(false)
            setFormData({
                desa: '',
                price: ''
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
                    Create New
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to your collection. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="desa" className="flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                Desa
                            </Label>
                            <Input
                                id="desa"
                                value={formData.desa}
                                onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Price
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                                <Input
                                    id="price"
                                    value={formData.price ? formatPrice(formData.price) : ''}
                                    onChange={handlePriceChange}
                                    required
                                    disabled={isLoading}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 