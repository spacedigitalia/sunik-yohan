'use client'

import React from 'react'

import { Card, CardContent } from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

export default function BlogSkeleton() {
    return (
        <section className="py-8 sm:py-12 pt-20 sm:pt-28">
            <div className="container px-4 md:px-8">
                {/* Top Blog Skeleton */}
                <div className="block mb-8 sm:mb-12">
                    <Card className="relative rounded-lg shadow-lg overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
                        <Skeleton className="absolute inset-0" />
                        <CardContent className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                            <Skeleton className="h-8 sm:h-10 w-3/4 mb-2" />
                            <Skeleton className="h-4 sm:h-5 w-full mb-3 sm:mb-4" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Remaining Blogs Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
                                <Skeleton className="absolute inset-0" />
                            </div>
                            <CardContent className="p-3 sm:p-4">
                                <Skeleton className="h-6 sm:h-7 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={index} className="h-8 w-8 rounded-md" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
