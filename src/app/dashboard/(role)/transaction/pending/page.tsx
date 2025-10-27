import React from 'react'

import TransactionPendingLayout from '@/hooks/dashboard/transaction/pending/TransactionPendingLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Transaction Pending | Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <TransactionPendingLayout />
    )
}
