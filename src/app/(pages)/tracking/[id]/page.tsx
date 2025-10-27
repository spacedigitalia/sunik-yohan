import React from 'react'

import { Metadata } from 'next'

import Tracking from "@/hooks/(pages)/tracking/Tracking"

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: 'Lacak Pesanan | Sunik Yohan',
    description: 'Lacak status pesanan Anda di Sunik Yohan',
    keywords: 'lacak pesanan, tracking, Sunik Yohan',
    openGraph: {
        title: 'Lacak Pesanan | Sunik Yohan',
        description: 'Lacak status pesanan Anda di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/products.png',
                width: 1200,
                height: 630,
                alt: 'Lacak Pesanan Sunik Yohan',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lacak Pesanan | Sunik Yohan',
        description: 'Lacak status pesanan Anda di Sunik Yohan',
        images: ['/public/products.png'],
    },
};

export default async function Page({ params }: Props) {
    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Lacak Pesanan", item: `${BASE_URL}/tracking` }
    ];

    const resolvedParams = await params
    return (
        <>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Tracking params={params} />
        </>
    )
}
