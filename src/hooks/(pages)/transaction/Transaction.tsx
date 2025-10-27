'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { doc, getDoc } from 'firebase/firestore';

import { db as transactionDb } from '@/utils/firebase/transaction';

import { Card } from '@/components/ui/card';

import Image from 'next/image';

import { formatPriceWithSymbol } from '@/base/helper/price';

import { CountdownTimer } from '@/hooks/(pages)/transaction/CountdownTimer';

import TransactionSkelaton from "@/hooks/(pages)/transaction/TransactionSkelaton"

import TransactionEror from "@/hooks/(pages)/transaction/TransactionEror"

import HeroTransaction from "@/hooks/(pages)/transaction/HeroTransaction"

import { TransactionData } from '@/types/Transaction';
import { toast } from "sonner";

export default function TransactionPage() {
    const params = useParams();
    const [transaction, setTransaction] = useState<TransactionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const transactionDocRef = doc(transactionDb, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string, params.id as string);
                const transactionDoc = await getDoc(transactionDocRef);

                if (transactionDoc.exists()) {
                    setTransaction(transactionDoc.data() as TransactionData);
                } else {
                    setError('Transaction not found');
                }
            } catch (err) {
                console.error('Error fetching transaction:', err);
                setError('Failed to load transaction');
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [params.id]);

    if (loading) {
        return (
            <TransactionSkelaton />
        );
    }

    if (error || !transaction) {
        return (
            <TransactionEror />
        );
    }

    return (
        <>
            <HeroTransaction />

            <section className="min-h-screen bg-gray-50 py-6 sm:py-12">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                        {/* User Information */}
                        <div>
                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Informasi Pengguna</h2>
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
                                        <Image
                                            src={transaction.userInfo.photoURL || '/default-avatar.png'}
                                            alt={transaction.userInfo.displayName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{transaction.userInfo.displayName}</h3>
                                        <p className="text-sm sm:text-base text-gray-600">{transaction.userInfo.email}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Transaction Details */}
                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Detail Transaksi</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">ID Transaksi</span>
                                        <span className="font-medium flex items-center gap-2">
                                            {transaction.transactionId}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(transaction.transactionId);
                                                    toast.success('ID Transaksi berhasil disalin!');
                                                }}
                                                className="ml-2 p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-[#FF204E] transition-colors flex items-center"
                                                title="Salin ID Transaksi"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                                Salin
                                            </button>
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tanggal Pesanan</span>
                                        <span className="font-medium">
                                            {new Date(transaction.orderDate).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${transaction.status === 'success' ? 'text-green-600' :
                                                transaction.status === 'failed' ? 'text-red-600' :
                                                    'text-gray-600'
                                                }`}>
                                                {transaction.status === 'success' ? 'Berhasil' :
                                                    transaction.status === 'failed' ? 'Gagal' :
                                                        'Tidak Diketahui'}
                                            </span>
                                            <div className="relative group">
                                                <svg
                                                    className="w-5 h-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-800 mb-2">Informasi Status</p>
                                                        <p className="text-gray-600">
                                                            {transaction.status === 'success' ? 'Pesanan telah dikonfirmasi dan sedang diproses' :
                                                                transaction.status === 'failed' ? 'Pesanan telah dibatalkan' :
                                                                    'Status tidak diketahui'}
                                                        </p>
                                                        {transaction.status === 'success' && (
                                                            <p className="text-green-600 mt-2 text-xs">
                                                                Pesanan Anda sedang diproses
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Waktu Tersisa</span>
                                        <CountdownTimer endTime={transaction.expirationTime} />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Informasi Pengiriman</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <span className="text-gray-600">Nama</span>
                                        <p className="font-medium">{transaction.shippingInfo.firstName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email</span>
                                        <p className="font-medium">{transaction.shippingInfo.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Telepon</span>
                                        <p className="font-medium">{transaction.shippingInfo.phone}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Tipe Alamat</span>
                                        <p className="font-medium capitalize">{transaction.shippingInfo.addressType}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">RT/RW</span>
                                        <p className="font-medium">RT {transaction.shippingInfo.rt} / RW {transaction.shippingInfo.rw}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Alamat</span>
                                        <p className="font-medium">
                                            {transaction.shippingInfo.streetName},
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Patokan</span>
                                        <p className="font-medium">
                                            {transaction.shippingInfo.landmark}
                                        </p>
                                    </div>

                                    {transaction.shippingInfo.district && (
                                        <div>
                                            <span className="text-gray-600">Lokasi</span>
                                            <div className="w-full h-[200px] rounded-xl overflow-hidden border border-gray-200 mt-2">
                                                <iframe
                                                    title="Peta Lokasi"
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(transaction.shippingInfo.district.split(',')[1]) - 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) - 0.002}%2C${parseFloat(transaction.shippingInfo.district.split(',')[1]) + 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) + 0.002}&layer=mapnik&marker=${transaction.shippingInfo.district.split(',')[0]},${transaction.shippingInfo.district.split(',')[1]}`}
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Ringkasan Pesanan</h2>
                                <div className="space-y-4 sm:space-y-6">
                                    {transaction.items.map((item: TransactionData['items'][0]) => (
                                        <div key={item.id} className="flex gap-4 sm:gap-6 items-center">
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800 text-base sm:text-lg">{item.title}</h3>
                                                <p className="text-[#FF204E] font-semibold text-base sm:text-lg mt-1">{item.price}</p>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Jumlah: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 mt-6 sm:mt-8 pt-4 sm:pt-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">
                                                {formatPriceWithSymbol(String(transaction.totalAmount - transaction.shippingCost))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Biaya Pengiriman</span>
                                            <span className="font-medium">
                                                {formatPriceWithSymbol(String(transaction.shippingCost))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <span className="font-medium text-gray-800 text-base sm:text-lg">Total Pembayaran:</span>
                                            <span className="text-[#FF204E] font-bold text-lg sm:text-xl">
                                                {formatPriceWithSymbol(String(transaction.totalAmount))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl">
                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Informasi Pembayaran</h2>
                                    <div className="relative group">
                                        <svg
                                            className="w-5 h-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-800 mb-2">Langkah Selanjutnya Setelah Pesanan</p>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                                    <li>Klik tombol ini untuk mengirim detail pesanan ke WhatsApp kami</li>
                                                    <li>Tim kami akan memverifikasi pembayaran dan detail pesanan Anda</li>
                                                    <li>Setelah dikonfirmasi, kami akan memproses pesanan Anda</li>
                                                    <li>Anda akan menerima pembaruan pengiriman melalui WhatsApp</li>
                                                    <li>Lacak status pesanan Anda di website kami</li>
                                                </ul>
                                                <p className="text-yellow-600 mt-2 text-xs">
                                                    Harap simpan ID transaksi Anda untuk melacak pesanan
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Metode Pembayaran</span>
                                        <span className="font-medium capitalize">{transaction.paymentInfo.method}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status Pembayaran</span>
                                        <span className={`font-medium ${transaction.paymentInfo.status === 'accepted' ? 'text-green-600' :
                                            transaction.paymentInfo.status === 'pending' ? 'text-yellow-600' :
                                                transaction.paymentInfo.status === 'rejected' ? 'text-red-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {transaction.paymentInfo.status === 'accepted' ? 'Diterima' :
                                                transaction.paymentInfo.status === 'pending' ? 'Menunggu' :
                                                    transaction.paymentInfo.status === 'rejected' ? 'Ditolak' :
                                                        'Tidak Diketahui'}
                                        </span>
                                    </div>
                                    {transaction.paymentInfo.proof && (
                                        <div>
                                            <span className="text-gray-600 block mb-2">Bukti Pembayaran</span>
                                            <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                                <Image
                                                    src={transaction.paymentInfo.proof}
                                                    alt="Bukti pembayaran"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* WhatsApp Button */}
                                    <div className="mt-4 sm:mt-6">
                                        <button
                                            onClick={() => {
                                                // Format order details for WhatsApp with modern emoji and formatting
                                                const orderDetails = `
🛍️ PESANAN BARU DITERIMA 🛍️
━━━━━━━━━━━━━━━━━━━━━━━━

📦 Informasi Pesanan
━━━━━━━━━━━━━━━━━━━━━━━━
* ID: \`${transaction.transactionId}\`
* Tanggal: ${new Date(transaction.orderDate).toLocaleString('id-ID')}
* Status: ${transaction.status === 'success' ? 'BERHASIL' :
                                                        transaction.status === 'failed' ? 'GAGAL' :
                                                            'MENUNGGU'}

👤 Detail Pelanggan
━━━━━━━━━━━━━━━━━━━━━━━━
* Nama: ${transaction.userInfo.displayName}
* Email: ${transaction.userInfo.email}

📍 Alamat Pengiriman
━━━━━━━━━━━━━━━━━━━━━━━━
Penerima : ${transaction.shippingInfo.firstName}
Jalan : ${transaction.shippingInfo.streetName}
${transaction.shippingInfo.city}, ${transaction.shippingInfo.province} ${transaction.shippingInfo.postalCode}
RT ${transaction.shippingInfo.rt} / RW ${transaction.shippingInfo.rw}
Patokan : ${transaction.shippingInfo.landmark}
📱 Telepon : ${transaction.shippingInfo.phone}

🛒 Item Pesanan
━━━━━━━━━━━━━━━━━━━━━━━━
${transaction.items.map((item: TransactionData['items'][0]) => `* ${item.title}
  └ ${item.quantity}x - ${item.price}`).join('\n')}

💰 Ringkasan Pembayaran
━━━━━━━━━━━━━━━━━━━━━━━━
* Metode : ${transaction.paymentInfo.method.toUpperCase()}
* Status : ${transaction.status === 'success' ? 'BERHASIL' : transaction.status === 'failed' ? 'GAGAL' : 'MENUNGGU'}
* Subtotal : ${formatPriceWithSymbol(String(transaction.totalAmount - transaction.shippingCost))}
* Biaya Pengiriman : ${formatPriceWithSymbol(String(transaction.shippingCost))}
* Total : ${formatPriceWithSymbol(String(transaction.totalAmount))}

📝 Catatan Tambahan
━━━━━━━━━━━━━━━━━━━━━━━━
${transaction.message || 'Tidak ada catatan tambahan'}

📱 Lacak Pesanan Anda
━━━━━━━━━━━━━━━━━━━━━━━━
Untuk melacak status pesanan Anda, silakan kunjungi:
https://sunikyohan.my.id/
Masukkan ID Transaksi Anda: \`${transaction.transactionId}\`

━━━━━━━━━━━━━━━━━━━━━━━━
Terima kasih atas pesanan Anda! 🎉`;

                                                // Encode the message for WhatsApp URL
                                                const encodedMessage = encodeURIComponent(orderDetails.trim());

                                                // Open WhatsApp with pre-filled message
                                                window.open(`https://wa.me/6281284258290?text=${encodedMessage}`, '_blank');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                                        >
                                            <svg
                                                className="        w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.        099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.7        88-1.48-1.761-1.653-2.059-.173-.297-.018        -.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.46        2 1.065 2.875 1.213 3.074.149.198 2.096         3.2 5.077 4.487.709.306 1.262.489 1.694.625.7        12.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248        -.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421         7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.        982.998-3.648-.235-.374a9.86 9.86 0 01-1.51        -5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Kirim Detail Pesanan via WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div >
            </section >
        </>
    );
}                                                                         