import React from 'react'

import NotFoundLayout from "@/hooks/NotFound/NotFoundLayout"

export const metadata = {
    title: '404 - Page not found',
    description: 'Halaman tidak ditemukan',
}

export default function NotFound() {
    return (
        <NotFoundLayout />
    )
}