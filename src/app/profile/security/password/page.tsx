import React from 'react'

import PasswordLayout from "@/hooks/profile/security/password/PasswordLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Change Password | Sunik Yohan',
    description: 'Perbarui pasword anda yang belum di perbarui.',
}

export default function AddressPage() {
    return (
        <PasswordLayout />
    )
}
