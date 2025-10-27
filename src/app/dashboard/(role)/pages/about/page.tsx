import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | About',
    description: 'Dashboard',
}

import AboutLayout from "@/hooks/dashboard/pages/about/AboutLayout"

export default function About() {
    return (
        <AboutLayout />
    )
}
