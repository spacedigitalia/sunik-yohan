import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Daily',
    description: 'Dashboard',
}

import DailyLayout from "@/hooks/dashboard/pages/daily/DailyLayout"

export default function Daily() {
    return (
        <DailyLayout />
    )
}
