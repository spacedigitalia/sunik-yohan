import React from 'react'

import AddressLayout from "@/hooks/profile/address/AdressLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kelola Alamat | Sunik Yohan',
    description: 'Kelola dan atur alamat pengiriman Anda di Sunik Yohan. Tambah, edit, atau hapus alamat untuk pengiriman produk.',
}

export default function AddressPage() {
    return (
        <AddressLayout />
    )
}
