import type { Metadata } from 'next'

import ProjectDetailsContent from '@/hooks/(pages)/products/[slug]/ProjectDetailsContent'

import { generateMetadata as getProductsMetadata } from '@/hooks/(pages)/products/[slug]/meta/metadata'

import { fetchProductsData, fetchProductsDataBySlug } from "@/components/content/products/utils/FetchProducts"

import ProductsSlugSkeleton from '@/hooks/(pages)/products/[slug]/ProductsSlugSkeleton';

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
        const [productData, allProducts] = await Promise.all([
            fetchProductsDataBySlug(resolvedParams.slug),
            fetchProductsData()
        ]);
        return (
            <ProjectDetailsContent slug={resolvedParams.slug} productsData={productData}
                allProducts={allProducts}
            />
        );
    } catch (error) {
        console.error('Error fetching products data:', error);
        return (
            <ProductsSlugSkeleton />
        );
    }
}