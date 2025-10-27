import React from 'react'

import { Metadata } from 'next'

import { redirect } from 'next/navigation'

import ForgotPasswordLayout from "@/hooks/auth/forgot-password/ForgotPasswordLayout"

import { cookies } from 'next/headers'

export const metadata: Metadata = {
    title: 'Lupa Kata Sandi | Sunik Yohan',
    description: 'Reset password akun Anda',
}

export default async function ForgotPassword() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (session) {
        redirect('/')
    }

    return (
        <ForgotPasswordLayout />
    )
}
