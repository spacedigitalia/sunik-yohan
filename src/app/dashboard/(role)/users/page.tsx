import React from 'react'

import UsersLayout from '@/hooks/dashboard/users/UsersLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Data User | Dashboard',
    description: 'Dashboard',
}

export default function page() {
    return (
        <UsersLayout />
    )
}
