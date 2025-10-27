import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Home',
    description: 'Dashboard',
}

import HomeLayout from "@/hooks/dashboard/pages/home/HomeLayout"

export default function Home() {
    return (
        <HomeLayout />
    )
}
