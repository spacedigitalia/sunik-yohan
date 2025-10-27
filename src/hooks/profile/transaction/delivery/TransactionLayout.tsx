"use client"

import React, { useEffect, useState } from 'react'

import { collection, query, where, onSnapshot } from 'firebase/firestore'

import { db } from '@/utils/firebase/transaction'

import { useAuth } from '@/utils/context/AuthContext'

import { ExtendedTransactionData } from '@/types/Transaction'

import { Card } from '@/components/ui/card'

import Image from 'next/image'

import { formatPriceWithSymbol } from '@/base/helper/price'

import OrderModal from './modal/OrderModal'

import ShippingInfo from './modal/ShippingInfo'

import DeliveryModal from './modal/DeliveryModal'

import { Pagination } from '@/components/ui/pagination'

interface DeliveryHistory {
    description: string;
    status: string;
    timestamp: string;
}

interface DeliveryStatus {
    status: string;
    estimatedDelivery: string;
    history: DeliveryHistory[];
}

export default function TransactionLayout() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6 // Number of items to show per page

    useEffect(() => {
        if (!user) return

        const transactionsRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string)
        const q = query(transactionsRef, where("userId", "==", user.uid))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const transactionData = querySnapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    ...data,
                    docId: doc.id,
                    deliveryStatus: data.deliveryStatus ? {
                        status: data.deliveryStatus.status,
                        estimatedDelivery: data.deliveryStatus.estimatedDelivery,
                        history: data.deliveryStatus.history || []
                    } as DeliveryStatus : undefined
                }
            }) as ExtendedTransactionData[]

            // Sort transactions by order date (newest first)
            const sortedTransactions = transactionData.sort((a, b) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            )

            setTransactions(sortedTransactions)
            setLoading(false)
        }, (error) => {
            console.error('Error fetching transactions:', error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    const filteredTransactions = transactions.filter(transaction => {
        if (!transaction.deliveryStatus) return false
        return transaction.deliveryStatus.status === 'delivering'
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    if (loading) {
        return (
            <section>
                {/* Header Skeleton */}
                <div className='flex justify-between mb-6'>
                    <div>
                        <div className="h-10 bg-gray-200 rounded w-64 mb-2 border-b pb-4"></div>
                        <div className="flex gap-6 items-center">
                            <div className="h-12 bg-gray-200 rounded-lg w-64"></div>
                            <div className="h-12 bg-gray-200 rounded-lg w-64"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-4">
                                    <div className="border-b pb-3">
                                        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                                        <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                                            <div className="h-3 bg-gray-200 rounded w-40"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                                    <div className="flex gap-2">
                                        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="h-10 bg-gray-200 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    if (filteredTransactions.length === 0) {
        return (
            <div>
                <div className="container px-4 py-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tidak Ada Transaksi Pengiriman</h2>
                        <p className="text-gray-600 text-lg mb-8">Anda tidak memiliki transaksi pengiriman apa pun saat ini.</p>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-center gap-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm">Riwayat transaksi Anda akan muncul di sini setelah Anda memiliki pesanan yang sedang dikirim</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section>
            {/* Header */}
            <div className='flex justify-between mb-6'>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 border-b pb-4">My Transactions</h1>
                    <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-700 font-medium">Total Transaksi Pengiriman: <span className="text-blue-600 font-bold">{filteredTransactions.length}</span></p>
                        </div>

                        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-700 font-medium">Subtotal: <span className="text-green-600 font-bold">{formatPriceWithSymbol(filteredTransactions.reduce((sum, transaction) => sum + Number(transaction.totalAmount), 0).toString())}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTransactions.map((transaction) => (
                    <Card key={transaction.docId} className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-4">
                                <div className="border-b pb-3">
                                    <h3 className="text-xl font-bold text-gray-900">Order #{transaction.transactionId}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(transaction.orderDate).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={transaction.userInfo.photoURL || '/default-avatar.png'}
                                            alt={transaction.userInfo.displayName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{transaction.userInfo.displayName}</p>
                                        <p className="text-sm text-gray-500">{transaction.userInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-2xl font-bold text-gray-900 bg-gray-50 p-3 rounded-lg text-center">
                                    {formatPriceWithSymbol(transaction.totalAmount.toString())}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <OrderModal transaction={transaction} />
                                    <ShippingInfo shippingInfo={transaction.shippingInfo} />
                                    {transaction.deliveryStatus && (
                                        <DeliveryModal transaction={transaction} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </section>
    )
} 