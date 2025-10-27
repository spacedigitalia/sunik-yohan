import React from 'react'

import Link from 'next/link'

export default function NotFoundLayout() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="container px-4 py-16 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Column - SVG */}
                    <div className="order-2 md:order-1">
                        <div className="max-w-lg mx-auto">
                            <svg
                                className="w-full h-auto"
                                viewBox="0 0 400 300"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M200 50C122.5 50 60 112.5 60 190C60 267.5 122.5 330 200 330C277.5 330 340 267.5 340 190C340 112.5 277.5 50 200 50ZM200 290C144.5 290 100 245.5 100 190C100 134.5 144.5 90 200 90C255.5 90 300 134.5 300 190C300 245.5 255.5 290 200 290Z"
                                    fill="#E5E7EB"
                                />
                                <path
                                    d="M200 120C166.5 120 140 146.5 140 180C140 213.5 166.5 240 200 240C233.5 240 260 213.5 260 180C260 146.5 233.5 120 200 120ZM200 220C177.5 220 160 202.5 160 180C160 157.5 177.5 140 200 140C222.5 140 240 157.5 240 180C240 202.5 222.5 220 200 220Z"
                                    fill="#9CA3AF"
                                />
                                <path
                                    d="M200 160C188.5 160 180 168.5 180 180C180 191.5 188.5 200 200 200C211.5 200 220 191.5 220 180C220 168.5 211.5 160 200 160Z"
                                    fill="#4B5563"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Right Column - Text Content */}
                    <div className="text-center md:text-left order-1 md:order-2">
                        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-600 mb-6">Halaman Tidak Ditemukan</h2>
                        <p className="text-gray-500 mb-8 max-w-md">
                            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
