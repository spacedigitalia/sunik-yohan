import React, { Fragment } from 'react';

import { fetchBlogData } from "@/components/content/blog/utils/FetchBlog"

import Blog from '@/hooks/(pages)/blog/BlogLayout';

import BlogSkeleton from '@/hooks/(pages)/blog/BlogSkeleton';

import { Metadata } from 'next';

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Blog | Sunik Yohan',
    description: 'Baca artikel dan wawasan terbaru kami di Sunik Yohan',
    keywords: 'blog, artikel, wawasan, Sunik Yohan',
    openGraph: {
        title: 'Blog | Sunik Yohan',
        description: 'Baca artikel dan wawasan terbaru kami di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/blog.png',
                width: 1200,
                height: 630,
                alt: 'Blog Sunik Yohan',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | Sunik Yohan',
        description: 'Baca artikel dan wawasan terbaru kami di Sunik Yohan',
        images: ['/public/blog.png'],
    },
};

export default async function Page() {
    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Blog", item: `${BASE_URL}/blog` }
    ];

    try {
        const blogData = await fetchBlogData();

        return <Fragment>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Blog blogData={blogData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching blog data:', error);
        return (
            <BlogSkeleton />
        );
    }
}