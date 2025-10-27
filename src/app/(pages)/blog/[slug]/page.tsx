import type { Metadata } from 'next'

import ProjectDetailsContent from '@/hooks/(pages)/blog/[slug]/BlogDetailsContent'

import { generateMetadata as getProductsMetadata } from '@/hooks/(pages)/blog/[slug]/meta/metadata'

import { fetchBlogData, fetchBlogDataBySlug } from "@/components/content/blog/utils/FetchBlog"

import BlogSlugSkeleton from '@/hooks/(pages)/blog/[slug]/BlogSlugSkeleton';

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const resolvedParams = await params
    return getProductsMetadata({ params: { slug: resolvedParams.slug } })
}

export default async function Page({ params }: Props) {
    try {
        const resolvedParams = await params
        const [blogData, allBlogs] = await Promise.all([
            fetchBlogDataBySlug(resolvedParams.slug),
            fetchBlogData()
        ]);
        return (
            <ProjectDetailsContent slug={resolvedParams.slug} blogData={blogData}
                allBlogs={allBlogs}
            />
        );
    } catch (error) {
        console.error('Error fetching blog data:', error);
        return (
            <BlogSlugSkeleton />
        );
    }
}