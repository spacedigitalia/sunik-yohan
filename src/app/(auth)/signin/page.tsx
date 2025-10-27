import React from 'react'

import { Metadata } from 'next'

import { redirect } from 'next/navigation'

import SigninLayout from "@/hooks/auth/signin/SigninLayout"

import { cookies } from 'next/headers'

import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Masuk | Sunik Yohan',
    description: 'Masuk ke akun Anda di Sunik Yohan',
    keywords: 'login, masuk, akun, Sunik Yohan',
    openGraph: {
        title: 'Masuk | Sunik Yohan',
        description: 'Masuk ke akun Anda di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
    },
    twitter: {
        card: 'summary',
        title: 'Masuk | Sunik Yohan',
        description: 'Masuk ke akun Anda di Sunik Yohan',
    },
}

export default async function Signin() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (session) {
        redirect('/')
    }

    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Masuk", item: `${BASE_URL}/signin` }
    ];

    return (
        <>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <SigninLayout />
        </>
    )
}
