import React from 'react'

import TransactionDeliveryLayout from '@/hooks/dashboard/transaction/delivery/TransactionDeliveryLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Transaction Deliver | Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <TransactionDeliveryLayout />
    )
}
