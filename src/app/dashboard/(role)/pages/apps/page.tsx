import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Apps',
    description: 'Dashboard',
}

import AppsLayout from "@/hooks/dashboard/pages/apps/AppsLayout"

export default function Apps() {
    return (
        <AppsLayout />
    )
}
