import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Services',
    description: 'Dashboard',
}

import ServicesLayout from "@/hooks/dashboard/pages/services/ServicesLayout"

export default function Services() {
    return (
        <ServicesLayout />
    )
}
