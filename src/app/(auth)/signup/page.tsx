import React from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import SignupLayout from "@/hooks/auth/signup/SignupLayout"
import { cookies } from 'next/headers'

export const metadata: Metadata = {
    title: 'Sign Up | Sunik Yohan',
    description: 'Sign up to your account',
}

export default async function Signup() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')

    if (session) {
        redirect('/')
    }

    return (
        <SignupLayout />
    )
}
