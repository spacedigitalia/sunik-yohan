import React from 'react'

export default function TransactionEror() {
    return (
        <section className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className="container px-4 mx-auto">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-64 h-64 mb-8">
                        <svg
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                        >
                            <path
                                d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
                                fill="#F3F4F6"
                            />
                            <path
                                d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z"
                                fill="#E5E7EB"
                            />
                            <path
                                d="M100 120C111.046 120 120 111.046 120 100C120 88.9543 111.046 80 100 80C88.9543 80 80 88.9543 80 100C80 111.046 88.9543 120 100 120Z"
                                fill="#D1D5DB"
                            />
                            <path
                                d="M100 110C105.523 110 110 105.523 110 100C110 94.4772 105.523 90 100 90C94.4772 90 90 94.4772 90 100C90 105.523 94.4772 110 100 110Z"
                                fill="#9CA3AF"
                            />
                            <path
                                d="M130 70L150 50M150 70L130 50"
                                stroke="#EF4444"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Oops! Transaksi Tidak Ditemukan
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-md">
                        Sepertinya transaksi yang Anda cari tidak dapat ditemukan.
                        Jangan khawatir, Anda bisa kembali ke halaman utama atau coba lagi nanti.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </section>
    )
}
