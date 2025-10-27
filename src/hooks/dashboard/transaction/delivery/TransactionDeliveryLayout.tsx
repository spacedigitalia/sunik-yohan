"use client"

import React from 'react'

import { formatPriceWithSymbol } from '@/base/helper/price'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { LayoutDashboard, FileText, Info, DollarSign } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import Image from 'next/image'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import TransactionPendingSkeleton from '@/hooks/dashboard/transaction/pending/TransactionPendingSkelaton'

import { useManagementTransactionDelivery } from './utils/UseManagementTransactionDelivery'

import OrderModal from './modal/OrderModal'

import DeliveryModal from './modal/DeliveryModal'

import ShipedModal from './modal/ShipedModal'

export default function TransactionLayout() {
    const { transactions, loading, updateTransactionStatus, deliveryStages } = useManagementTransactionDelivery();

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary sm:w-8 sm:h-8"
                        >
                            <path
                                d="M21 7L12 16L3 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M3 17L12 8L21 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight">Transaction Delivery</h1>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 capitalize">
                                    <LayoutDashboard className="h-4 w-4" />
                                    dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/transaction/transaction" className="flex items-center gap-1 capitalize">
                                    <FileText className="h-4 w-4" />
                                    Transaction
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Info className="h-4 w-4" />
                                    Transaction Delivery
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            {loading ? (
                <TransactionPendingSkeleton />
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-64 h-64 mb-6">
                        <svg
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full text-gray-300"
                        >
                            <path
                                d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 100V100.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 60V60.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 140V140.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M60 100H60.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M140 100H140.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Transaksi Pengiriman</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        Saat ini tidak ada transaksi pengiriman untuk ditampilkan. Transaksi baru akan muncul di sini ketika dibuat.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {transactions.map((transaction) => (
                        <Card key={transaction.transactionId} className="w-full hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <CardTitle className="text-base sm:text-lg">Transaction #{transaction.transactionId}</CardTitle>
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.deliveryStatus?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            transaction.deliveryStatus?.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                transaction.deliveryStatus?.status === 'delivering' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {transaction.deliveryStatus?.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Customer Information */}
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="relative aspect-square w-12 sm:w-16 rounded-full overflow-hidden">
                                            <Image
                                                src={transaction.userInfo.photoURL || '/default-avatar.png'}
                                                alt={transaction.userInfo.displayName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm sm:text-base">{transaction.userInfo.displayName}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{transaction.userInfo.email}</p>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                                            <DollarSign className="h-4 w-4" />
                                            Order Summary
                                        </h4>
                                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg space-y-2">
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span>Items Total</span>
                                                <span>{formatPriceWithSymbol((transaction.totalAmount - transaction.shippingCost).toString())}</span>
                                            </div>
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span>Shipping Cost</span>
                                                <span>{formatPriceWithSymbol(transaction.shippingCost.toString())}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between text-xs sm:text-sm">
                                                <span className="font-medium">Total</span>
                                                <span className="font-medium">{formatPriceWithSymbol(transaction.totalAmount.toString())}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="space-y-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                        <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                                            <Info className="h-4 w-4" />
                                            Delivery Status
                                        </h4>

                                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                            <Select
                                                value={transaction.deliveryStatus?.status || 'pending'}
                                                onValueChange={(value) => {
                                                    if (transaction.docId) {
                                                        updateTransactionStatus(transaction.docId, value);
                                                    }
                                                }}
                                                disabled={transaction.deliveryStatus?.status === 'completed'}
                                            >
                                                <SelectTrigger className={`w-full sm:w-[120px] ${transaction.deliveryStatus?.status === 'completed' ? 'cursor-not-allowed' : ''}`}>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {deliveryStages.map((stage) => (
                                                        <SelectItem key={stage.id} value={stage.id}>
                                                            {stage.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="border-t pt-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            <OrderModal transaction={transaction} />

                                            <DeliveryModal transaction={transaction} />

                                            <ShipedModal transaction={transaction} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    )
}
