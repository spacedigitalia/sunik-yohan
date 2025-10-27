"use client"

import React, { useState, useRef } from 'react'

import { format, formatDistanceToNow, differenceInMonths } from 'date-fns'

import { id } from 'date-fns/locale'

import Image from 'next/image'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { motion } from 'framer-motion'

import varcha1 from "@/base/assets/Rectangle1.png"

import varcha2 from "@/base/assets/Rectangle3.png"

import { BlogData } from '@/components/content/blog/types/blog'

export default function Blog({ blogData }: { blogData: BlogData[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    // Add scroll event listener
    React.useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScroll);
            // Initial check
            checkScroll();
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', checkScroll);
            }
        };
    }, []);

    return (
        <section className='py-8 sm:py-12 md:py-16 lg:py-20 bg-white relative'>
            <div className='container px-4 md:px-6 lg:px-10'>
                <div className='flex flex-col sm:flex-row justify-between items-start md:items-center mb-6 sm:mb-10 md:mb-16'>
                    <div className='flex flex-col gap-1 sm:gap-2 mb-4 sm:mb-0'>
                        <span className='text-sm sm:text-base md:text-lg text-[#FF204E] leading-relaxed font-medium'>Blog</span>
                        <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#333333] mt-1 sm:mt-2 md:mt-3 mb-2 sm:mb-4 md:mb-6 max-w-lg'>Blog Terbaru Kami</h3>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Link href="/blog">
                            <Button className='bg-[#FF204E] text-white text-sm sm:text-base px-4 sm:px-6'>
                                Lihat Semua Blog
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className='relative'>
                    <style jsx>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
                    >
                        {blogData
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 6)
                            .map((blog, index) => (
                                <div
                                    key={blog.id}
                                    className="w-[calc(33.333%-16px)] min-w-[300px]"
                                >
                                    <Card className="group w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                        <CardContent className="p-0 relative overflow-hidden">
                                            <div className="aspect-[4/3] relative overflow-hidden">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 50 }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    viewport={{ once: true, amount: 0.3 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1
                                                    }}
                                                    className="w-full h-full"
                                                >
                                                    <Image
                                                        src={blog.thumbnail}
                                                        alt={blog.title}
                                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                        fill
                                                    />
                                                </motion.div>
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <div className='absolute bottom-4 right-4 bg-[#FF204E] text-white px-3 py-1 rounded-md text-sm'>
                                                {differenceInMonths(new Date(), new Date(blog.createdAt)) >= 1
                                                    ? format(new Date(blog.createdAt), 'dd MMM yyyy', { locale: id })
                                                    : formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true, locale: id })
                                                }
                                            </div>
                                        </CardContent>
                                        <CardHeader className='p-4 sm:p-6 text-center'>
                                            <CardTitle className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-1 md:line-clamp-2'>{blog.title}</CardTitle>
                                            <CardDescription className='text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2'>
                                                {blog.description}
                                            </CardDescription>
                                            <Link href={`/blog/${blog.slug}`} className='text-red-500 hover:text-red-600 font-medium flex items-center justify-center text-sm sm:text-base'>
                                                Baca Blog
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.5 8.5l4 4-4 4M3.5 12.5h18" />
                                                </svg>
                                            </Link>
                                        </CardHeader>
                                    </Card>
                                </div>
                            ))}
                    </div>

                    {/* Mobile Navigation Buttons */}
                    <div className="flex justify-center items-center gap-4 mt-4 sm:hidden">
                        {/* Left Navigation Button */}
                        <button
                            onClick={() => handleScroll('left')}
                            disabled={!canScrollLeft}
                            className='w-10 h-10 rounded-full bg-[#FF204E] flex items-center justify-center text-white hover:bg-[#FF204E]/80 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 active:bg-[#FF204E]/90 active:shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed'
                            aria-label="Previous page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200 active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>

                        {/* Right Navigation Button */}
                        <button
                            onClick={() => handleScroll('right')}
                            disabled={!canScrollRight}
                            className='w-10 h-10 rounded-full bg-[#FF204E] flex items-center justify-center text-white hover:bg-[#FF204E]/80 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 active:bg-[#FF204E]/90 active:shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed'
                            aria-label="Next page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200 active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Navigation Buttons */}
                    <button
                        onClick={() => handleScroll('left')}
                        disabled={!canScrollLeft}
                        className='hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FF204E] items-center justify-center text-white hover:bg-[#FF204E]/80 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 active:bg-[#FF204E]/90 active:shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed'
                        aria-label="Previous page"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200 active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>

                    <button
                        onClick={() => handleScroll('right')}
                        disabled={!canScrollRight}
                        className='hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-[#FF204E] items-center justify-center text-white hover:bg-[#FF204E]/80 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 active:bg-[#FF204E]/90 active:shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed'
                        aria-label="Next page"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200 active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>

            <motion.div
                className="absolute top-2 left-56 transform block"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                    duration: 0.8
                }}
            >
                <motion.div
                    className="relative"
                    animate={{
                        y: [0, -20, 0, -20, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                >
                    <Image
                        src={varcha1}
                        alt='varchar'
                        className="relative w-6 h-6"
                    />
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute bottom-5 right-20 transform block"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                    duration: 0.8
                }}
            >
                <motion.div
                    className="relative"
                    animate={{
                        y: [0, -20, 0, -20, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                >
                    <Image
                        src={varcha2}
                        alt='varchar'
                        className="relative w-6 h-6"
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}
