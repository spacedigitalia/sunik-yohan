import React from 'react'

import TransactionCompletedLayout from '@/hooks/dashboard/transaction/completed/TransactionCompletedLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Transaction Completed | Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <TransactionCompletedLayout />
    )
}
