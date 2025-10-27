import React from 'react'

import { Skeleton } from "@/components/ui/skeleton"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TransactionPendingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 sm:space-y-6">
                            {/* Customer Information Skeleton */}
                            <div className="flex items-start gap-3 sm:gap-4">
                                <Skeleton className="w-12 sm:w-16 h-12 sm:h-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-40" />
                                </div>
                            </div>

                            {/* Order Summary Skeleton */}
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-28" />
                                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="border-t pt-2 flex justify-between">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Status Skeleton */}
                            <div className="space-y-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <Skeleton className="h-5 w-28" />
                                <Skeleton className="h-10 w-[120px]" />
                            </div>

                            {/* Action Buttons Skeleton */}
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
