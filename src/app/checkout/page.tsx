import React from 'react'

import CheckoutContent from "@/hooks/(pages)/checkout/CheckoutLayout"

import { Metadata } from 'next'

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Checkout | Sunik Yohan',
    description: 'Lengkapi pembayaran pesanan Anda di Sunik Yohan',
    keywords: 'checkout, pembayaran, pesanan, Sunik Yohan',
    openGraph: {
        title: 'Checkout | Sunik Yohan',
        description: 'Lengkapi pembayaran pesanan Anda di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
    },
    twitter: {
        card: 'summary',
        title: 'Checkout | Sunik Yohan',
        description: 'Lengkapi pembayaran pesanan Anda di Sunik Yohan',
    },
}

export default async function Checkout() {
    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Produk", item: `${BASE_URL}/products` },
        { name: "Checkout", item: `${BASE_URL}/checkout` }
    ];

    return (
        <>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <CheckoutContent />
        </>
    )
}