import React from 'react'

import TransactionLayout from '@/hooks/profile/transaction/delivery/TransactionLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Transaction Delivery | Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <TransactionLayout />
    )
}
