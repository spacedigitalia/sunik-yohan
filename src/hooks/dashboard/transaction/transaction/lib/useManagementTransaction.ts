import { useState, useEffect } from 'react'
import { collection, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db as transactionDb } from '@/utils/firebase/transaction'
import { db as productDb } from '@/utils/firebase/Firebase'
import { toast } from 'sonner'
import { ExtendedTransactionData } from "@/types/Transaction"

export const useManagementTransaction = () => {
    const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(transactionDb, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string), (querySnapshot) => {
            const transactionData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                docId: doc.id
            })) as ExtendedTransactionData[];

            const sortedTransactions = transactionData.sort((a, b) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );

            setTransactions(sortedTransactions);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.paymentInfo?.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const updateTransactionStatus = async (docId: string, newStatus: string) => {
        try {
            const transactionRef = doc(transactionDb, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string, docId);
            const transactionDoc = await getDoc(transactionRef);
            const transactionData = transactionDoc.data();

            // Update transaction status
            await updateDoc(transactionRef, {
                paymentInfo: {
                    ...transactionData?.paymentInfo,
                    status: newStatus
                }
            });

            // If status is accepted, update product stock
            if (newStatus === 'accepted' && transactionData) {
                // Update stock for each item in the transaction
                for (const item of transactionData.items) {
                    const productRef = doc(productDb, process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string, item.id);
                    const productDoc = await getDoc(productRef);

                    if (productDoc.exists()) {
                        const productData = productDoc.data();
                        const currentStock = parseInt(productData.stock) || 0;
                        const newStock = Math.max(0, currentStock - item.quantity);

                        await updateDoc(productRef, {
                            stock: newStock.toString(),
                            sold: (parseInt(productData.sold) || 0) + item.quantity
                        });
                    }
                }
            }

            // Show success notification
            toast.success('Status transaksi berhasil diperbarui', {
                description: `Status diubah menjadi ${newStatus === 'pending' ? 'Menunggu' :
                    newStatus === 'accepted' ? 'Diterima' : 'Ditolak'}`
            });
        } catch (error) {
            console.error('Error updating transaction status:', error);
            // Show error notification
            toast.error('Gagal memperbarui status transaksi', {
                description: 'Terjadi kesalahan saat memperbarui status'
            });
        }
    };

    return {
        transactions: filteredTransactions,
        loading,
        updateTransactionStatus,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter
    }
} 