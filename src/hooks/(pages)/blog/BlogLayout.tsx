'use client'

import React from 'react'

import { motion } from 'framer-motion'

import { BlogData } from '@/components/content/blog/types/blog'

import Image from 'next/image'

import Link from 'next/link'

import profile from "@/base/assets/logo.png"

import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

import { Pagination } from "@/components/ui/pagination"

interface BlogLayoutProps {
    blogData: BlogData[]
    pagination?: {
        hasNextPage: boolean
        hasPrevPage: boolean
        totalPages: number
        totalItems: number
    }
    currentPage?: number
    onPageChange?: (page: number) => void
}

export default function BlogLayout({
    blogData,
    pagination = { hasNextPage: false, hasPrevPage: false, totalPages: 1, totalItems: 0 },
    currentPage = 1,
    onPageChange = () => { }
}: BlogLayoutProps) {
    const sortedBlogs = [...blogData].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const topBlog = sortedBlogs[0]
    // Get all blogs except the top blog
    const remainingBlogs = sortedBlogs.slice(1)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <motion.section
            className="py-8 sm:py-12 pt-20 sm:pt-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
        >
            <div className="container px-4 md:px-8">
                {/* Top Blog Section */}
                {topBlog && (
                    <motion.div variants={itemVariants}>
                        <Link href={`/blog/${topBlog.slug}`} className="block mb-8 sm:mb-12">
                            <Card className="relative rounded-lg shadow-lg overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
                                <Image
                                    src={topBlog.thumbnail}
                                    alt={topBlog.title}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                <CardContent className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{topBlog.title}</CardTitle>
                                    <CardDescription className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 line-clamp-2">{topBlog.description}</CardDescription>
                                    <div className="flex items-center text-xs sm:text-sm text-gray-300 mb-2">
                                        <Image src={profile} alt="Author" width={16} height={16} className="rounded-full mr-2 sm:w-5 sm:h-5" />
                                        <span>Sunik Yohan</span>
                                        <span className="mx-2"> • </span>
                                        <span>{formatDate(topBlog.createdAt)}</span>
                                    </div>
                                </CardContent>
                                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                    </svg>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                )}

                {/* All Blogs Section */}
                {remainingBlogs.length > 0 && (
                    <motion.div variants={containerVariants}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {remainingBlogs.map((blog) => (
                                <motion.div key={blog.id} variants={itemVariants}>
                                    <Link href={`/blog/${blog.slug}`}>
                                        <Card className="hover:shadow-lg transition-shadow">
                                            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
                                                <Image
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 hover:scale-110"
                                                />
                                            </div>
                                            <CardContent className="p-3 sm:p-4">
                                                <CardTitle className="text-base sm:text-lg font-semibold mb-2">{blog.title}</CardTitle>
                                                <CardDescription className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{blog.description}</CardDescription>
                                                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                                    <Image src={profile} alt="Author" width={16} height={16} className="rounded-full mr-2 sm:w-5 sm:h-5" />
                                                    <span>Sunik Yohan</span>
                                                    <span className="mx-2"> • </span>
                                                    <span>{formatDate(blog.createdAt)}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Pagination */}
                <motion.div
                    className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4"
                    variants={itemVariants}
                >
                    <div className="text-xs sm:text-sm text-muted-foreground">
                        Page {currentPage} of {pagination.totalPages}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                    />
                </motion.div>
            </div>
        </motion.section>
    )
}
