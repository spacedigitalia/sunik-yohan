"use client"

import React from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'

export default function BlogSlugSkeleton() {
    return (
        <section className='pt-24 md:pt-10 py-20 bg-gradient-to-b from-gray-50 to-white'>
            <div className='container px-4'>
                {/* Header Section Skeleton */}
                <div className='mb-10 md:mt-16 text-center'>
                    <Skeleton className='h-16 w-3/4 mx-auto mb-6' />
                    <div className='flex items-center justify-center gap-4 mb-8'>
                        <Skeleton className='h-6 w-32' />
                    </div>
                    <Skeleton className='aspect-[16/9] w-full rounded-2xl' />
                </div>

                {/* Content Section Skeleton */}
                <div className='space-y-6'>
                    <Skeleton className='h-8 w-full' />
                    <Skeleton className='h-8 w-5/6' />
                    <Skeleton className='h-8 w-4/6' />
                    <Skeleton className='h-8 w-full' />
                    <Skeleton className='h-8 w-5/6' />
                    <Skeleton className='h-8 w-4/6' />
                </div>

                {/* Related Posts Section Skeleton */}
                <div className='mt-10 md:mt-16'>
                    <div className='flex items-center gap-3 mb-10'>
                        <Skeleton className='w-12 h-1' />
                        <Skeleton className='h-8 w-48' />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {[1, 2, 3].map((index) => (
                            <Card key={index} className='h-full bg-white rounded-2xl overflow-hidden shadow-xl'>
                                <Skeleton className='aspect-[16/9] w-full' />
                                <CardHeader>
                                    <Skeleton className='h-6 w-full mb-2' />
                                    <Skeleton className='h-6 w-3/4' />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className='h-4 w-full mb-2' />
                                    <Skeleton className='h-4 w-5/6' />
                                    <div className='mt-4'>
                                        <Skeleton className='h-4 w-32' />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
