"use client"

import React from 'react'

import { motion } from 'framer-motion'

import { Skeleton } from '@/components/ui/skeleton'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function HomeSkeleton() {
    return (
        <>
            <section className='relative flex flex-col items-center justify-center min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden'>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                    <div className="absolute -bottom-24 -left-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-purple-200 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-pink-200 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container relative px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 py-8 md:py-12">
                        <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
                            <div className="space-y-4 md:space-y-6">
                                <Skeleton className="h-12 md:h-16 w-full" />
                                <Skeleton className="h-24 md:h-32 w-full" />
                            </div>
                            <Skeleton className="h-12 w-48" />
                        </div>

                        <div className="flex-1 relative w-full max-w-xl mt-8 lg:mt-0">
                            <div className="absolute -right-4 md:-right-8 top-0 w-8 md:w-16 h-full bg-gradient-to-b from-amber-200 to-amber-50 rounded-r-3xl shadow-lg"></div>
                            <Skeleton className="relative aspect-square w-full rounded-3xl shadow-2xl" />
                        </div>
                    </div>

                    <motion.div
                        className="absolute top-10 left-0 w-full transform"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{
                            opacity: [0.7, 1, 0.7],
                            y: [0, -10, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Skeleton className="w-20 h-20 md:w-28 md:h-28 rounded-3xl" />
                    </motion.div>
                </div>
            </section>

            <section className='relative py-8 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden'>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -bottom-12 md:-bottom-24 -left-12 md:-left-24 w-[200px] sm:w-[300px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[600px] bg-gradient-to-r from-[#e8a674]/50 via-[#e8a674]/30 to-[#e8a674]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[600px] bg-gradient-to-r from-[#e8a674]/40 via-[#e8a674]/20 to-[#e8a674]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container relative px-4 sm:px-6">
                    {[1].map((idx) => (
                        <motion.div
                            key={idx}
                            className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 md:gap-20 xl:gap-28 py-8 sm:py-12 md:py-20"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                        >
                            <motion.div
                                className="flex-1 relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-2xl mx-auto lg:mx-0 mt-4 lg:mt-0"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: idx * 0.3 }}
                            >
                                <div className="absolute -right-2 sm:-right-4 md:-right-8 top-0 w-4 sm:w-8 md:w-16 h-full bg-gradient-to-b from-[#e8a674]/70 to-[#e8a674]/30 rounded-r-3xl shadow-lg"></div>
                                <Skeleton className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl" />
                            </motion.div>

                            <motion.div
                                className="flex-1 space-y-6 sm:space-y-8 md:space-y-10 text-center lg:text-left z-[50] px-4 sm:px-0"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: idx * 0.3 }}
                            >
                                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                    <Skeleton className="h-12 sm:h-16 md:h-20 w-full" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>

                                <Skeleton className="h-12 sm:h-14 md:h-16 w-40 sm:w-48 md:w-56" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className='py-16 lg:py-20 bg-white relative'>
                <div className="container px-4 md:px-10">
                    <div className='flex flex-col sm:flex-row justify-between items-start md:items-center mb-10 sm:mb-20'>
                        <div className='flex flex-col gap-2 mb-0'>
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-12 w-64 mt-2" />
                            <Skeleton className="h-10 w-32 mt-4" />
                        </div>

                        <div className='hidden md:block'>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Menu Categories Skeleton */}
                        <div className="w-full lg:w-1/4 border-b lg:border-b-0 pb-4 lg:pb-0 lg:pr-10 mb-6 lg:mb-0">
                            <div className="flex lg:flex-col gap-2 lg:gap-3">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Product Cards Skeleton */}
                        <div className="w-full lg:w-3/4">
                            <div className="flex gap-6 overflow-x-auto pb-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} className="w-[300px] sm:w-[400px] flex-shrink-0">
                                        <Skeleton className="aspect-[4/3] w-full" />
                                        <CardContent className="p-6">
                                            <div className="space-y-2">
                                                <Skeleton className="h-6 w-3/4" />
                                                <Skeleton className="h-6 w-1/4" />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-6 pt-0">
                                            <div className="flex gap-3 w-full">
                                                <Skeleton className="h-10 flex-1" />
                                                <Skeleton className="h-10 flex-1" />
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='block md:hidden'>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-8 sm:py-12 md:py-16 lg:py-20 bg-white relative'>
                <div className='container px-4 md:px-6 lg:px-10'>
                    <div className='flex flex-col sm:flex-row justify-between items-start md:items-center mb-6 sm:mb-10 md:mb-16'>
                        <div className='flex flex-col gap-1 sm:gap-2 mb-4 sm:mb-0'>
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-12 w-64 mt-1 sm:mt-2 md:mt-3" />
                        </div>

                        <div className='flex items-center gap-4'>
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>

                    <div className='relative'>
                        <div className="flex gap-6 overflow-x-auto pb-6">
                            {[1, 2, 3].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0"
                                >
                                    <Card className="w-[300px] sm:w-[400px] overflow-hidden">
                                        <CardContent className="p-0 relative overflow-hidden">
                                            <div className="aspect-[4/3] relative overflow-hidden">
                                                <Skeleton className="w-full h-full" />
                                            </div>
                                            <div className='absolute bottom-4 right-4'>
                                                <Skeleton className="h-6 w-24" />
                                            </div>
                                        </CardContent>
                                        <CardHeader className='p-4 sm:p-6 text-center'>
                                            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-2/3 mx-auto mb-3 sm:mb-4" />
                                            <Skeleton className="h-6 w-24 mx-auto" />
                                        </CardHeader>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
} 