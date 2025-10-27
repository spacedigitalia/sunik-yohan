import React from 'react'

import ProfileLayout from "@/hooks/profile/profile/ProfileLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kelola Profile | Sunik Yohan',
    description: 'Perbarui data - data anda yang belum di perbarui.',
}

export default function AddressPage() {
    return (
        <ProfileLayout />
    )
}
