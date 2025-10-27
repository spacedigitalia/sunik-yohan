import React from 'react'

import TransactionLayout from '@/hooks/profile/transaction/completed/TransactionLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Transaction Completed | Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <TransactionLayout />
    )
}
