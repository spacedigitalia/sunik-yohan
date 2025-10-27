import React from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SignupLayout from "@/hooks/auth/signup/SignupLayout"
import { cookies } from 'next/headers'
import { BreadcrumbJsonLd, getBaseUrl } from '@/base/helper/BreadCrumJson';

export const metadata: Metadata = {
    title: 'Daftar | Sunik Yohan',
    description: 'Daftar akun baru di Sunik Yohan',
    keywords: 'register, daftar, signup, akun baru, Sunik Yohan',
    openGraph: {
        title: 'Daftar | Sunik Yohan',
        description: 'Daftar akun baru di Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
    },
    twitter: {
        card: 'summary',
        title: 'Daftar | Sunik Yohan',
        description: 'Daftar akun baru di Sunik Yohan',
    },
}

export default async function Signup() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (session) {
        redirect('/')
    }

    const BASE_URL = getBaseUrl();
    const breadcrumbItems = [
        { name: "Beranda", item: BASE_URL },
        { name: "Daftar", item: `${BASE_URL}/signup` }
    ];

    return (
        <>
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <SignupLayout />
        </>
    )
}
