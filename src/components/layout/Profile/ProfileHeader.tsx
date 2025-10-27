"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase/transaction";
import { formatPriceWithSymbol } from '@/base/helper/price';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TransactionData } from '@/utils/firebase/transaction';

export default function ProfileHeader() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<TransactionData[]>([]);
    const router = useRouter();

    const handleTransactionClick = () => {
        router.push(`/profile/transaction/transaction`);
    };

    useEffect(() => {
        if (!user?.uid) return;

        const transactionsRef = collection(db, 'transaction');
        const q = query(
            transactionsRef,
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newTransactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                transactionId: doc.id
            })) as TransactionData[];
            setNotifications(newTransactions);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    return (
        <div className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 flex-1 max-w-md ml-12 lg:ml-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari Product Kami..."
                        className="pl-9 bg-background/50 h-9 text-sm"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9">
                            <Bell className="h-4 w-4" />
                            {notifications.length > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                                >
                                    {notifications.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] lg:w-96">
                        <div className="px-4 py-3 border-b">
                            <h3 className="font-semibold text-base">Recent Transactions</h3>
                        </div>
                        <DropdownMenuSeparator />
                        <ScrollArea className="h-[300px]">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    No recent transactions
                                </div>
                            ) : (
                                notifications.map((transaction) => (
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
                                        <div className="flex items-center justify-between w-full">
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
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
} 