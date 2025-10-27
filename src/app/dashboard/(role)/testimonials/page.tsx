import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Testimonials',
    description: 'Dashboard',
}

import TestimonialsLayout from "@/hooks/dashboard/testimonials/TestimonialsLayout"

export default function Gallery() {
    return (
        <TestimonialsLayout />
    )
}
