'use client';

import React, { useEffect, useState } from 'react'

import { Chart } from '@/components/ui/chart'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Activity, Users, TrendingUp, Home, Package, FileText, ShoppingCart } from 'lucide-react'

import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

import { db } from '@/utils/firebase/Firebase'

import { db as transactionDb } from '@/utils/firebase/transaction'

import { TransactionData } from '@/utils/firebase/transaction'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import Image from 'next/image'

import { formatPriceWithSymbol } from '@/base/helper/price'

interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    status: string;
}

export default function DashboardLayout() {
    const [homeCount, setHomeCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [blogCount, setBlogCount] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pendingTransactions, setPendingTransactions] = useState(0);
    const [completedTransactions, setCompletedTransactions] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([]);

    const fetchData = async () => {
        try {
            const gallerySnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_GALLERY as string));
            setHomeCount(gallerySnapshot.size);

            const productsSnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string));
            setProductsCount(productsSnapshot.size);

            const blogSnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_BLOG as string));
            setBlogCount(blogSnapshot.size);

            const usersQuery = query(
                collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string),
                where('role', '==', 'user')
            );
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as User[];

            setUsers(usersData);
            setUserCount(usersData.length);

            // Fetch transaction data
            const transactionsSnapshot = await getDocs(collection(transactionDb, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string));
            const transactions = transactionsSnapshot.docs.map(doc => ({
                ...doc.data(),
                transactionId: doc.id
            })) as TransactionData[];

            setTotalTransactions(transactions.length);
            setTotalAmount(transactions.reduce((sum, t) => sum + t.totalAmount, 0));
            setPendingTransactions(transactions.filter(t => t.status === 'pending').length);
            setCompletedTransactions(transactions.filter(t => t.status === 'completed').length);

            const recentQuery = query(
                collection(transactionDb, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string),
                orderBy('orderDate', 'desc'),
                limit(6)
            );
            const recentSnapshot = await getDocs(recentQuery);
            const recentData = recentSnapshot.docs.map(doc => ({
                ...doc.data(),
                transactionId: doc.id
            })) as TransactionData[];
            setRecentTransactions(recentData);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTransactionClick = (transaction: TransactionData) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    return (
        <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gallery</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{homeCount}</div>
                        <p className="text-xs text-muted-foreground">Total items in gallery</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">Total registered users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsCount}</div>
                        <p className="text-xs text-muted-foreground">Total products in collection</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{blogCount}</div>
                        <p className="text-xs text-muted-foreground">Total blogs in collection</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTransactions}</div>
                        <p className="text-xs text-muted-foreground">Total number of transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPriceWithSymbol(totalAmount.toString())}</div>
                        <p className="text-xs text-muted-foreground">Total transaction amount</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingTransactions}</div>
                        <p className="text-xs text-muted-foreground">Transactions awaiting processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedTransactions}</div>
                        <p className="text-xs text-muted-foreground">Successfully completed transactions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Transaction Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Chart />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Recent Transactions</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentTransactions.map((transaction) => (
                        <Card
                            key={transaction.transactionId}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-none bg-white"
                            onClick={() => handleTransactionClick(transaction)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                                <CardTitle className="text-sm font-medium">Transaction #{transaction.transactionId}</CardTitle>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {transaction.userInfo.photoURL ? (
                                                <Image
                                                    src={transaction.userInfo.photoURL as string}
                                                    alt="User Profile"
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Users className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{transaction.userInfo.displayName}</p>
                                            <p className="text-xs text-muted-foreground">{transaction.userInfo.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Amount</p>
                                            <p className="text-sm font-medium">{formatPriceWithSymbol(transaction.totalAmount.toString())}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Date</p>
                                            <p className="text-sm font-medium">
                                                {new Date(transaction.orderDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {recentTransactions.length === 0 && (
                        <Card className="col-span-3">
                            <CardContent className="flex items-center justify-center h-32">
                                <p className="text-sm text-muted-foreground">
                                    No recent transactions found.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Transaction Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-xl font-semibold">Transaction Details</DialogTitle>
                    </DialogHeader>
                    {selectedTransaction && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium mb-3">Customer Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    {selectedTransaction.userInfo.photoURL ? (
                                                        <Image
                                                            src={selectedTransaction.userInfo.photoURL as string}
                                                            alt="User Profile"
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <Users className="h-5 w-5 text-gray-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{selectedTransaction.userInfo.displayName}</p>
                                                    <p className="text-xs text-muted-foreground">{selectedTransaction.userInfo.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium mb-3">Order Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-muted-foreground">Amount</p>
                                                <p className="text-sm font-medium">{formatPriceWithSymbol(selectedTransaction.totalAmount.toString())}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-muted-foreground">Status</p>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    selectedTransaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-muted-foreground">Date</p>
                                                <p className="text-sm font-medium">
                                                    {new Date(selectedTransaction.orderDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium mb-3">Shipping Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {selectedTransaction.shippingInfo.streetName}, {selectedTransaction.shippingInfo.city}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{selectedTransaction.shippingInfo.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium mb-3">Payment Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-muted-foreground">Method</p>
                                                <p className="text-sm font-medium">{selectedTransaction.paymentInfo.method}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-muted-foreground">Status</p>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${selectedTransaction.paymentInfo.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    selectedTransaction.paymentInfo.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {selectedTransaction.paymentInfo.status.charAt(0).toUpperCase() + selectedTransaction.paymentInfo.status.slice(1)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedTransaction.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                                            <div className="relative w-16 h-16">
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium">{item.title}</h4>
                                                <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{formatPriceWithSymbol(item.price)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Total: {formatPriceWithSymbol((Number(item.price) * item.quantity).toString())}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    )
}
