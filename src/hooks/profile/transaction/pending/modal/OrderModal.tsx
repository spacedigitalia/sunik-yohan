import React from 'react'

import Image from 'next/image'

import { formatPriceWithSymbol } from '@/base/helper/price'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { ShoppingBag } from "lucide-react"

import { ExtendedTransactionData } from "@/types/Transaction"

interface OrderModalProps {
    transaction: ExtendedTransactionData;
}

export default function OrderModal({ transaction }: OrderModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-1 sm:gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Order Items</span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Items</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6">
                    <div className="grid gap-3 sm:gap-4">
                        {transaction.items.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors">
                                <div className="relative aspect-square w-full sm:w-24 rounded-lg overflow-hidden border border-gray-200">
                                    <Image
                                        src={item.thumbnail}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h4 className="font-semibold text-base sm:text-lg">{item.title}</h4>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs sm:text-sm text-gray-600">Price per item</span>
                                            <span className="text-xs sm:text-sm font-medium">{formatPriceWithSymbol(item.price)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs sm:text-sm text-gray-600">Subtotal</span>
                                            <span className="text-xs sm:text-sm font-semibold">{formatPriceWithSymbol((parseFloat(item.price) * item.quantity).toString())}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 sm:w-5 sm:h-5">
                                            <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-sm sm:text-lg">Total Items</span>
                                </div>
                                <span className="font-semibold text-sm sm:text-lg bg-blue-50 text-blue-600 px-3 sm:px-4 py-1 rounded-full">{transaction.items.reduce((total, item) => total + item.quantity, 0)} items</span>
                            </div>
                            <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600 sm:w-5 sm:h-5">
                                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-sm sm:text-lg">Subtotal</span>
                                </div>
                                <span className="font-semibold text-sm sm:text-lg bg-purple-50 text-purple-600 px-3 sm:px-4 py-1 rounded-full">{formatPriceWithSymbol(transaction.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toString())}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 sm:w-5 sm:h-5">
                                            <path d="M5 8H19M5 8C3.89543 8 3 7.10457 3 6V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V6C21 7.10457 20.1046 8 19 8M5 8V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V8M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-sm sm:text-lg">Shipping Cost</span>
                                </div>
                                <span className="font-semibold text-sm sm:text-lg bg-green-50 text-green-600 px-3 sm:px-4 py-1 rounded-full">{formatPriceWithSymbol(transaction.shippingCost.toString())}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600 sm:w-5 sm:h-5">
                                            <path d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-sm sm:text-lg">Total Amount</span>
                                </div>
                                <span className="font-semibold text-sm sm:text-lg bg-orange-50 text-orange-600 px-3 sm:px-4 py-1 rounded-full">{formatPriceWithSymbol(transaction.totalAmount.toString())}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
