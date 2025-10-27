import React from 'react'

import BlogLayout from '@/hooks/dashboard/blog/BlogLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blogs | Sunik Yohan',
    description: 'Dashboard',
}

export default function page() {
    return (
        <BlogLayout />
    )
}
