import React from 'react'

import { Card } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export default function TransactionSkelaton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
            <div className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                    {/* User Information */}
                    <div>
                        <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">User Information</h2>
                            <div className="flex items-center gap-4 sm:gap-6">
                                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        </Card>

                        {/* Transaction Details */}
                        <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Transaction Details</h2>
                            <div className="space-y-3 sm:space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Shipping Information */}
                        <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Shipping Information</h2>
                            <div className="space-y-3 sm:space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i}>
                                        <Skeleton className="h-4 w-16 mb-2" />
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                ))}
                                <Skeleton className="w-full h-[200px] rounded-xl" />
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Order Summary</h2>
                            <div className="space-y-4 sm:space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex gap-4 sm:gap-6 items-center">
                                        <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-5 w-1/3" />
                                            <Skeleton className="h-4 w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 mt-6 sm:mt-8 pt-4 sm:pt-6">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-6 w-40" />
                                </div>
                            </div>
                        </Card>

                        {/* Payment Information */}
                        <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Payment Information</h2>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                ))}
                                <Skeleton className="w-full h-48 rounded-xl" />
                                <Skeleton className="w-full h-12 rounded-xl" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
