'use client';

import { useEffect, useState, use } from "react";

import { useRouter } from "next/navigation";

import { collection, query, where, onSnapshot } from "firebase/firestore";

import { db } from "@/utils/firebase/transaction";

import TrackingSkeleton from "./TrackingSkelaton";

import HeroTracking from "@/hooks/(pages)/tracking/HeroTracking"

import { TransactionData } from '@/types/Transaction';

const deliveryStages = [
    { id: 'pending', label: 'Pending', description: 'Order has been placed' },
    { id: 'processing', label: 'Processing', description: 'Order is being prepared' },
    { id: 'delivering', label: 'Delivering', description: 'Order is on the way' },
    { id: 'completed', label: 'Completed', description: '   ' }
];

const transactionStages = [
    { id: 'pending', label: 'Pending', description: 'Order has been placed and waiting for confirmation' },
    { id: 'accepted', label: 'Accepted', description: 'Order has been accepted by the seller' },
    { id: 'rejected', label: 'Rejected', description: 'Order has been rejected by the seller' }
];

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [transaction, setTransaction] = useState<TransactionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const resolvedParams = use(params);

    useEffect(() => {
        const transactionsRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string);
        const q = query(transactionsRef, where("transactionId", "==", resolvedParams.id));

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                if (querySnapshot.empty) {
                    setError("Transaction not found");
                    setLoading(false);
                    return;
                }

                const transactionData = querySnapshot.docs[0].data() as TransactionData;
                setTransaction(transactionData);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching transaction:", error);
                setError("Error fetching transaction details");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [resolvedParams.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <TrackingSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!transaction) return null;

    // Get the latest status from history
    const latestHistory = transaction.deliveryStatus?.history?.[transaction.deliveryStatus?.history?.length - 1] || { status: 'pending' };
    const currentStageIndex = deliveryStages.findIndex(stage => stage.id === latestHistory.status.toLowerCase());

    return (
        <>
            <HeroTracking />
            <section className="min-h-screen bg-gray-50 py-6 sm:py-10">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                        {/* Left Column - Order Status and Timeline */}
                        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 h-fit space-y-4 sm:space-y-8">

                            {/* Order Details */}
                            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">Order Details</h2>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-medium">{transaction.transactionId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="font-medium">Rp {transaction.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Status</p>
                                        <p className="font-medium">{transaction.paymentInfo.status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">Order Status</h2>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600">Current Status:</span>
                                        <span className="font-medium text-red-500 capitalize">{transaction.status}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600">Transaction Status:</span>
                                        <span className={`font-medium capitalize ${transaction.status === 'failed' ? 'text-red-500' :
                                            transaction.status === 'success' ? 'text-green-500' :
                                                'text-yellow-500'
                                            }`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Order Date:</span>
                                        <span className="font-medium">{formatDate(transaction.orderDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">Order Items</h2>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {transaction.items.map((item: TransactionData['items'][0], index: number) => (
                                        <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-600">Price: Rp {item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Delivery Progress and Order Details */}
                        <div className="space-y-4 sm:space-y-8">
                            {/* User Information */}
                            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">User Information</h2>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                                    <img
                                        src={transaction.userInfo.photoURL}
                                        alt={transaction.userInfo.displayName}
                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-900">{transaction.userInfo.displayName}</h3>
                                        <p className="text-sm text-gray-600">{transaction.userInfo.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">Shipping Information</h2>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Name</p>
                                                <p className="font-medium">{transaction.shippingInfo.firstName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-medium">{transaction.shippingInfo.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium">{transaction.shippingInfo.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Postal Code</p>
                                                <p className="font-medium">{transaction.shippingInfo.postalCode}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-4">
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-medium">{transaction.shippingInfo.streetName}</p>
                                            <p className="font-medium">
                                                {transaction.shippingInfo.city}, {transaction.shippingInfo.province}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-2">Landmark</p>
                                            <p className="font-medium">{transaction.shippingInfo.landmark}</p>
                                            {transaction.shippingInfo.district && (
                                                <div className="mt-3 sm:mt-4">
                                                    <p className="text-sm text-gray-600 mb-2">Location</p>
                                                    <iframe
                                                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6666666666665!2d${transaction.shippingInfo.district.split(',')[1]}!3d${transaction.shippingInfo.district.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzMnMzYuNiJTIDEwNsKwNDYnNTEuOSJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid`}
                                                        width="100%"
                                                        height="200"
                                                        style={{ border: 0 }}
                                                        allowFullScreen
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Timeline */}
                            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">Delivery Progress</h2>
                                </div>
                                <div className="relative">
                                    {/* Progress Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
                                        <div
                                            className="absolute top-0 left-0 w-full bg-red-500 transition-all duration-500"
                                            style={{
                                                height: `${(currentStageIndex / (deliveryStages.length - 1)) * 100}%`
                                            }}
                                        />
                                    </div>

                                    {/* Timeline Items */}
                                    <div className="space-y-6 sm:space-y-8">
                                        {deliveryStages.map((stage, index) => {
                                            const isCompleted = index < currentStageIndex;
                                            const isCurrent = index === currentStageIndex;
                                            const stageHistory = transaction.deliveryStatus?.history?.filter(
                                                item => item.status.toLowerCase() === stage.id
                                            ) || [];

                                            return (
                                                <div key={stage.id} className="relative flex items-start">
                                                    {/* Timeline Dot */}
                                                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10
                                                        ${isCompleted ? 'bg-red-500' : isCurrent ? 'bg-red-500' : 'bg-gray-200'}`}>
                                                        {isCompleted ? (
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : (
                                                            <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-gray-400'}`} />
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="ml-10 sm:ml-12 w-full">
                                                        <div className={`font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                                                            {stage.label}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {stage.description}
                                                        </div>
                                                        {isCurrent && (
                                                            <div className="mt-2 text-sm text-red-500">
                                                                Current Status
                                                            </div>
                                                        )}

                                                        {/* History Entries */}
                                                        {stageHistory.length > 0 && (
                                                            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                                                                {stageHistory.map((historyItem: { status: string; timestamp: string; description: string }, historyIndex: number) => (
                                                                    <div
                                                                        key={historyIndex}
                                                                        className="bg-gray-50 rounded-lg p-2 sm:p-3"
                                                                    >
                                                                        <div className="text-sm font-medium text-gray-700">
                                                                            {historyItem.description}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {formatDate(historyItem.timestamp)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Timeline */}
                            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-700">Transaction Status</h2>
                                </div>
                                <div className="relative">
                                    {/* Progress Line */}
                                    {(() => {
                                        // Filter stages based on paymentInfo.status
                                        let filteredStages = transactionStages;
                                        if (transaction.paymentInfo.status === 'accepted') {
                                            filteredStages = transactionStages.filter(stage => stage.id !== 'rejected');
                                        } else if (transaction.paymentInfo.status === 'rejected') {
                                            filteredStages = transactionStages.filter(stage => stage.id !== 'accepted');
                                        }
                                        const currentIndex = filteredStages.findIndex(s => s.id === transaction.paymentInfo.status);
                                        return (
                                            <>
                                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
                                                    <div
                                                        className="absolute top-0 left-0 w-full bg-purple-500 transition-all duration-500"
                                                        style={{
                                                            height: `${(currentIndex / (filteredStages.length - 1)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                {/* Timeline Items */}
                                                <div className="space-y-6 sm:space-y-8">
                                                    {filteredStages.map((stage, index) => {
                                                        const isCompleted = index < currentIndex;
                                                        const isCurrent = index === currentIndex;
                                                        return (
                                                            <div key={stage.id} className="relative flex items-start">
                                                                {/* Timeline Dot */}
                                                                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10
                                                                    ${isCompleted ? 'bg-purple-500' : isCurrent ? 'bg-purple-500' : 'bg-gray-200'}`}>
                                                                    {isCompleted ? (
                                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    ) : (
                                                                        <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-gray-400'}`} />
                                                                    )}
                                                                </div>
                                                                {/* Content */}
                                                                <div className="ml-10 sm:ml-12 w-full">
                                                                    <div className={`font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                        {stage.label}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 mt-1">
                                                                        {stage.description}
                                                                    </div>
                                                                    {isCurrent && (
                                                                        <div className="mt-2 text-sm text-purple-500">
                                                                            Current Status
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
} 