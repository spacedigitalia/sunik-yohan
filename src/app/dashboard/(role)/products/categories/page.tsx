import React from 'react'

import CategoriesLayout from '@/hooks/dashboard/products/categories/CategoriesLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Products Categories | Sunik Yohan',
    description: 'Dashboard',
}

export default function page() {
    return (
        <CategoriesLayout />
    )
}
