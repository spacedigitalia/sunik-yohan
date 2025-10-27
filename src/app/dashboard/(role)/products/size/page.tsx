import React from 'react'

import ProductsSizesLayout from '@/hooks/dashboard/products/sizes/ProductsSizesLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Products Sizes | Sunik Yohan',
    description: 'Dashboard',
}

export default function page() {
    return (
        <ProductsSizesLayout />
    )
}
