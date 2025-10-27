import React from 'react'

import DashboardLayout from '@/hooks/dashboard/DashboardLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <DashboardLayout />
    )
}
