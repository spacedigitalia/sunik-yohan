import React from 'react'

import SecurityLayout from "@/hooks/profile/security/delete/SecurityLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Delete Accounts | Sunik Yohan',
    description: 'Delete accounts.',
}

export default function Delete() {
    return (
        <SecurityLayout />
    )
}
