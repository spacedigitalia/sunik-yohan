import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Gallery',
    description: 'Dashboard',
}

import GalleryLayout from "@/hooks/dashboard/gallery/GalleryLayout"

export default function Gallery() {
    return (
        <GalleryLayout />
    )
}
