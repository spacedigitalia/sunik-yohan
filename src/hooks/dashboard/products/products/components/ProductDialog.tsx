import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        price: string;
        shopeUrl: string;
        thumbnail: string;
        category: string;
        size: string;
        content: string;
        stock: string;
        description: string;
    };
    onSubmit: (data: any, imageFile?: File) => void;
    isLoading?: boolean;
}

export function ProductDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isLoading,
}: ProductDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {initialData ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <ProductForm
                        initialData={initialData}
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
} 