import React from 'react'

import BannerLayout from '@/hooks/dashboard/products/banner/BannerLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Products Banner | Sunik Yohan',
    description: 'Dashboard',
}

export default function page() {
    return (
        <BannerLayout />
    )
}
