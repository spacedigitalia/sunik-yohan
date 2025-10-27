"use client"

import React, { useState, useEffect } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { User, Bell, Menu } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { formatPriceWithSymbol } from '@/base/helper/price';

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

import { db } from '@/utils/firebase/transaction';

import { TransactionData } from '@/utils/firebase/transaction';

import Image from 'next/image';

import { useRouter } from 'next/navigation';

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([]);
    const router = useRouter();

    const handleTransactionClick = () => {
        setShowNotifications(false);
        router.push(`/dashboard/transaction/transaction`);
    };

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                const recentQuery = query(
                    collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string),
                    orderBy('orderDate', 'desc'),
                    limit(10)
                );
                const recentSnapshot = await getDocs(recentQuery);
                const recentData = recentSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    transactionId: doc.id
                })) as TransactionData[];
                setRecentTransactions(recentData);
            } catch (error) {
                console.error('Error fetching recent transactions:', error);
            }
        };

        fetchRecentTransactions();
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full bg-background border-b">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onMenuClick}
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground line-clamp-1">
                            Hello, {user?.displayName || 'User'}!
                        </h2>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            Welcome back to your dashboard
                        </p>
                    </div>
                </div>

                {/* Right side - Profile and notifications */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Notifications */}
                    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                                    {recentTransactions.length}
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-96">
                            <div className="px-4 py-3 border-b">
                                <h3 className="font-semibold text-base">Recent Transactions</h3>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {recentTransactions.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-muted-foreground">
                                        No recent transactions
                                    </div>
                                ) : (
                                    recentTransactions.map((transaction) => (
                                        <DropdownMenuItem
                                            key={transaction.transactionId}
                                            className="flex flex-col items-start gap-2 p-4 hover:bg-accent/50 cursor-pointer"
                                            onClick={() => handleTransactionClick()}
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-primary/10">
                                                    {transaction.userInfo.photoURL ? (
                                                        <Image
                                                            src={transaction.userInfo.photoURL}
                                                            alt={transaction.userInfo.displayName}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <User className="w-5 h-5 text-primary" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{transaction.userInfo.displayName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(transaction.orderDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between w-full items-center bg-muted/50 px-3 py-2 rounded-md">
                                                <p className="text-sm text-muted-foreground truncate">Transaksi #{transaction.transactionId}</p>
                                                <p className="text-sm font-medium ml-2 flex-shrink-0">{formatPriceWithSymbol(transaction.totalAmount.toString())}</p>
                                            </div>
                                            <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </div>
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
} 