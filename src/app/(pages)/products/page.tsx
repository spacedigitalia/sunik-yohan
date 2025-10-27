import React, { Fragment } from 'react';

import { fetchProductsData } from "@/components/content/products/utils/FetchProducts"

import { fetchBannerData } from "@/hooks/(pages)/products/banner/utils/FetchBanner"

import Product from '@/hooks/(pages)/products/ProductsLayout';

import ProductSkeleton from '@/hooks/(pages)/products/ProductsSkeleton';

import { Metadata } from 'next';

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Produk | Sunik Yohan',
    description: 'Jelajahi koleksi produk kami di Sunik Yohan',
    keywords: 'produk, koleksi, Sunik Yohan',
    openGraph: {
        title: 'Produk | Sunik Yohan',
        description: 'Jelajahi koleksi produk kami di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/products.png',
                width: 1200,
                height: 630,
                alt: 'Produk Sunik Yohan',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Produk | Sunik Yohan',
        description: 'Jelajahi koleksi produk kami di Sunik Yohan',
        images: ['/public/products.png'],
    },
};

export default async function Page() {
    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Produk", item: `${BASE_URL}/products` }
    ];

    try {
        const productsData = await fetchProductsData();
        const bannerData = await fetchBannerData();

        return <Fragment>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Product productsData={productsData} bannerData={bannerData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching products data:', error);
        return (
            <ProductSkeleton />
        );
    }
}