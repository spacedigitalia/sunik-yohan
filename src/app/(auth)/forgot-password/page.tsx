import React from 'react'

import { Metadata } from 'next'

import { redirect } from 'next/navigation'

import ForgotPasswordLayout from "@/hooks/auth/forgot-password/ForgotPasswordLayout"

import { cookies } from 'next/headers'

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Lupa Kata Sandi | Sunik Yohan',
    description: 'Reset kata sandi akun Anda di Sunik Yohan',
    keywords: 'lupa password, reset kata sandi, Sunik Yohan',
    openGraph: {
        title: 'Lupa Kata Sandi | Sunik Yohan',
        description: 'Reset kata sandi akun Anda di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
    },
    twitter: {
        card: 'summary',
        title: 'Lupa Kata Sandi | Sunik Yohan',
        description: 'Reset kata sandi akun Anda di Sunik Yohan',
    },
}

export default async function ForgotPassword() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (session) {
        redirect('/')
    }

    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Masuk", item: `${BASE_URL}/signin` },
        { name: "Lupa Kata Sandi", item: `${BASE_URL}/forgot-password` }
    ];

    return (
        <>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <ForgotPasswordLayout />
        </>
    )
}
