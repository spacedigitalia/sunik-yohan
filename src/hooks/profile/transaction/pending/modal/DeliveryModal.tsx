import React from 'react'

import { Clock, Package, Truck, ShoppingBag } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { ExtendedTransactionData } from "@/types/Transaction"

interface DeliveryModalProps {
    transaction: ExtendedTransactionData;
}

export default function DeliveryModal({ transaction }: DeliveryModalProps) {
    const deliveryStatus = transaction.deliveryStatus;

    if (!deliveryStatus) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-1 sm:gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Truck className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Delivery</span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Delivery Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div>
                                <h4 className="font-medium text-sm sm:text-base">Current Status</h4>
                                <p className="text-xs sm:text-sm text-gray-600">{deliveryStatus.status}</p>
                            </div>
                            {deliveryStatus.estimatedDelivery && (
                                <div>
                                    <h4 className="font-medium text-sm sm:text-base">Estimated Delivery</h4>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {new Date(deliveryStatus.estimatedDelivery).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Status-specific content */}
                        {deliveryStatus.status === 'pending' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-yellow-600">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <p className="font-medium text-sm sm:text-base">Waiting for Processing</p>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Your order has been received and is waiting to be processed. We'll update you once we start preparing your order.
                                </p>
                            </div>
                        )}

                        {deliveryStatus.status === 'processing' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <p className="font-medium text-sm sm:text-base">Order is Being Prepared</p>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Our team is currently preparing your order. This includes quality checks and packaging.
                                </p>
                            </div>
                        )}

                        {deliveryStatus.status === 'delivering' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-purple-600">
                                    <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <p className="font-medium text-sm sm:text-base">On the Way</p>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Your order is out for delivery. Our delivery partner will contact you when they arrive.
                                </p>
                            </div>
                        )}

                        {deliveryStatus.status === 'completed' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-green-600">
                                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <p className="font-medium text-sm sm:text-base">Order Delivered</p>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Your order has been successfully delivered. Thank you for shopping with us!
                                </p>
                            </div>
                        )}

                        {deliveryStatus.history && deliveryStatus.history.length > 0 && (
                            <div className="mt-6 space-y-3">
                                <h4 className="font-medium text-sm sm:text-base">Delivery History</h4>
                                <div className="space-y-3">
                                    {deliveryStatus.history.map((status, index) => {
                                        const isLastItem = index === deliveryStatus.history.length - 1;
                                        const statusColor =
                                            status.status === 'pending' ? 'text-yellow-600' :
                                                status.status === 'processing' ? 'text-blue-600' :
                                                    status.status === 'delivering' ? 'text-purple-600' :
                                                        'text-green-600';

                                        const statusIcon =
                                            status.status === 'pending' ? <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                                status.status === 'processing' ? <Package className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                                    status.status === 'delivering' ? <Truck className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />;

                                        return (
                                            <div key={index} className="relative">
                                                {!isLastItem && (
                                                    <div className="absolute left-[10px] top-[30px] bottom-0 w-[2px] bg-gray-200" />
                                                )}
                                                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                                                    <div className={`flex-shrink-0 ${statusColor}`}>
                                                        {statusIcon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className={`font-medium text-sm sm:text-base ${statusColor}`}>
                                                                    {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                                                                </p>
                                                                {isLastItem && (
                                                                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                                                        Latest
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(status.timestamp).toLocaleString('id-ID', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{status.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
