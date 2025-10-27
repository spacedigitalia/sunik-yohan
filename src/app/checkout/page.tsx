import React from 'react'

import CheckoutContent from "@/hooks/(pages)/checkout/CheckoutLayout"

export async function generateMetadata() {
    return {
        title: 'Checkout | Sunik Yohan',
        description: 'Checkout page',
    }
}

export default function Checkout() {
    return (
        <CheckoutContent />
    )
}