import React, { Fragment } from 'react';

import { fetchProductsData } from "@/components/content/products/utils/FetchProducts"

import { fetchBannerData } from "@/hooks/(pages)/products/banner/utils/FetchBanner"

import Product from '@/hooks/(pages)/products/ProductsLayout';

import ProductSkeleton from '@/hooks/(pages)/products/ProductsSkeleton';

import { Metadata } from 'next';

import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Products | Sunik Yohan',
    description: 'Explore our collection of products at Sunik Yohan',
    keywords: 'products, collection, Sunik Yohan',
    openGraph: {
        title: 'Products | Sunik Yohan',
        description: 'Explore our collection of products at Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/products.png', // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: 'Sunik Yohan Products',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Products | Sunik Yohan',
        description: 'Explore our collection of products at Sunik Yohan',
        images: ['/public/products.png'], // Same image as OpenGraph
    },
};

export default async function Page() {
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://spacedigitalia.my.id" },
            { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://spacedigitalia.my.id/products" }
        ]
    }
    try {
        const productsData = await fetchProductsData();
        const bannerData = await fetchBannerData();

        return <Fragment>
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd)
                }}
                strategy="afterInteractive"
            />
            <Product productsData={productsData} bannerData={bannerData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching products data:', error);
        return (
            <ProductSkeleton />
        );
    }
}