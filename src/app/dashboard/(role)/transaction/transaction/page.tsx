import React from 'react'

import TransactionLayout from '@/hooks/dashboard/transaction/transaction/TransactionLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Transaction | Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <TransactionLayout />
    )
}
