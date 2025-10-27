"use client"

import React, { Fragment } from 'react'

import { motion } from 'framer-motion'

import { Skeleton } from '@/components/ui/skeleton'

export default function AboutSkeleton() {
    return (
        <Fragment>
            <section className="bg-white py-8 sm:py-12 md:py-20">
                <div className="container px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-20">
                        {/* Left Section - Image Skeleton */}
                        <div className="w-full lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                <Skeleton className="w-full h-[500px] rounded-lg" />
                            </motion.div>
                        </div>

                        {/* Right Section - Content and Testimonials Skeleton */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <div className="space-y-6">
                                {/* Title Skeleton */}
                                <Skeleton className="h-6 w-32 mx-auto lg:mx-0" />

                                {/* Description Skeleton */}
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-3/4 mx-auto lg:mx-0" />
                                    <Skeleton className="h-8 w-2/3 mx-auto lg:mx-0" />
                                </div>

                                {/* Testimonial Skeleton */}
                                <div className="space-y-4">
                                    <Skeleton className="h-24" />
                                    <div className="flex items-center justify-center lg:justify-start gap-4">
                                        <Skeleton className="w-14 h-14 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Buttons Skeleton */}
                                <div className="flex justify-center lg:justify-start gap-4 mt-6">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Apps Section Skeleton */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16 lg:py-20">
                <div className="container px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24">
                        {/* Left Section - Download App Content Skeleton */}
                        <div className="text-center lg:text-left">
                            <div className="space-y-6">
                                <Skeleton className="h-8 w-40 mx-auto lg:mx-0 rounded-full" />
                                <div className="space-y-3">
                                    <Skeleton className="h-12 w-3/4 mx-auto lg:mx-0" />
                                    <Skeleton className="h-12 w-2/3 mx-auto lg:mx-0" />
                                </div>
                                <Skeleton className="h-6 w-48 mx-auto lg:mx-0" />
                                <Skeleton className="h-12 w-40 mx-auto lg:mx-0 rounded-full" />
                            </div>
                        </div>

                        {/* Right Section - Mobile App Content Skeleton */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-md">
                                <Skeleton className="w-full h-[600px] rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}
