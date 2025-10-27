import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Ongkir',
    description: 'Dashboard',
}

import OngkirLayout from "@/hooks/dashboard/pages/ongkir/OngkirLayout"

export default function ongkir() {
    return (
        <OngkirLayout />
    )
}
