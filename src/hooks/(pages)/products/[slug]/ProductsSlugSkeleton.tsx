import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsSlugSkeleton() {
    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image skeleton */}
                <div className="w-full aspect-square">
                    <Skeleton className="w-full h-full" />
                </div>

                {/* Content skeleton */}
                <div className="space-y-6">
                    {/* Title skeleton */}
                    <Skeleton className="h-8 w-3/4" />

                    {/* Price skeleton */}
                    <Skeleton className="h-6 w-1/4" />

                    {/* Description skeletons */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Button skeleton */}
                    <Skeleton className="h-10 w-full md:w-1/2" />
                </div>
            </div>
        </section>
    )
}
