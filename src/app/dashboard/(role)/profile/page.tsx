import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile | Dashboard',
    description: 'Dashboard',
}

import ProfileLayout from "@/hooks/dashboard/profile/ProfileLayout"

export default function Profile() {
    return (
        <ProfileLayout />
    )
}
