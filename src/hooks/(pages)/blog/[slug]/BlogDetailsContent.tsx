"use client"

import React from 'react'

import { BlogData } from '@/components/content/blog/types/blog'

import Link from 'next/link'

import Image from 'next/image'

import { format } from 'date-fns'

import { id } from 'date-fns/locale'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectDetailsContentProps {
    slug: string;
    blogData: BlogData | BlogData[];
    allBlogs: BlogData[];
}

export default function ProjectDetailsContent({ slug, blogData, allBlogs }: ProjectDetailsContentProps) {
    const blogsArray = Array.isArray(blogData) ? blogData : [blogData];
    const blog = blogsArray[0];

    if (!blog) {
        return <section className='min-h-screen py-12 bg-white'>blog not found</section>;
    }

    const formattedDate = format(new Date(blog.createdAt), 'dd MMMM yyyy', { locale: id });

    return (
        <section className='pt-24 md:pt-10 py-20 bg-gradient-to-b from-gray-50 to-white'>
            <div className='container px-4'>
                {/* Header Section */}
                <div className='mb-10 md:mt-16 text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
                        {blog.title}
                    </h1>

                    <div className='flex items-center justify-center gap-4 text-gray-600 mb-8'>
                        <span className='flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formattedDate}
                        </span>
                    </div>

                    <div className='relative aspect-[16/9] w-full rounded-2xl overflow-hidden'>
                        <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            fill
                            className='object-cover'
                            priority
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className='prose prose-lg max-w-none'>
                    <div
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                        className='
                            prose-h3:text-3xl prose-h3:font-bold prose-h3:text-gray-900 prose-h3:mb-6
                            prose-h4:text-2xl prose-h4:font-semibold prose-h4:text-gray-800 prose-h4:mt-8 prose-h4:mb-4
                            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg
                            prose-strong:font-bold prose-strong:text-gray-900
                        '
                    />
                </div>

                {/* Related Posts Section */}
                {allBlogs.length > 1 && (
                    <div className='mt-10 md:mt-16'>
                        <h2 className='text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3'>
                            <span className='w-12 h-1 bg-blue-500 rounded-full'></span>
                            Artikel Terkait
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                            {allBlogs
                                .filter(relatedBlog => relatedBlog.slug !== blog.slug)
                                .slice(0, 3)
                                .map((relatedBlog) => (
                                    <Link href={`/blog/${relatedBlog.slug}`} key={relatedBlog.id}>
                                        <Card className='h-full bg-white rounded-2xl overflow-hidden shadow-xl'>
                                            <div className='relative aspect-[16/9] w-full'>
                                                <Image
                                                    src={relatedBlog.thumbnail}
                                                    alt={relatedBlog.title}
                                                    fill
                                                    className='object-cover'
                                                />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className='text-xl font-bold text-gray-900 line-clamp-2'>
                                                    {relatedBlog.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className='text-gray-600 line-clamp-2'>{relatedBlog.description}</p>
                                                <div className='mt-4 flex items-center gap-2 text-sm text-gray-500'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {format(new Date(relatedBlog.createdAt), 'dd MMM yyyy', { locale: id })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
