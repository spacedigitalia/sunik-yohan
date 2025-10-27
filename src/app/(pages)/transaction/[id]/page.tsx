import React from 'react'

import { Metadata } from 'next'

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Transaksi | Sunik Yohan',
    description: 'Lihat detail transaksi Anda di Sunik Yohan',
    keywords: 'transaksi, pembayaran, Sunik Yohan',
    openGraph: {
        title: 'Transaksi | Sunik Yohan',
        description: 'Lihat detail transaksi Anda di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/products.png',
                width: 1200,
                height: 630,
                alt: 'Transaksi Sunik Yohan',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Transaksi | Sunik Yohan',
        description: 'Lihat detail transaksi Anda di Sunik Yohan',
        images: ['/public/products.png'],
    },
};

import Transaction from "@/hooks/(pages)/transaction/Transaction"

export default async function page() {
    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Transaksi", item: `${BASE_URL}/transaction` }
    ];

    return (
        <>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Transaction />
        </>
    )
}
