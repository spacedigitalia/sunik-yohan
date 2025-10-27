"use client"

import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export default function GallerySkeleton() {
    return (
        <section className='py-8 sm:py-12 pt-20 sm:pt-28'>
            <div className='container px-4 md:px-8'>
                <div className="columns-2 sm:columns-3 gap-3 sm:gap-4">
                    {[...Array(11)].map((_, index) => (
                        <div key={index} className="break-inside-avoid mb-3 sm:mb-4">
                            <Skeleton className="w-full aspect-[4/3] rounded-lg" />
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <div className="flex justify-center gap-2">
                        {[...Array(3)].map((_, index) => (
                            <Skeleton key={index} className="h-10 w-10 rounded-md" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
} 