import React from 'react'

import Image from 'next/image'

import { CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { ExtendedTransactionData } from "@/types/Transaction"

interface PaymentModalProps {
    transaction: ExtendedTransactionData;
}

export default function PaymentModal({ transaction }: PaymentModalProps) {
    const paymentInfo = transaction.paymentInfo;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'text-green-600';
            case 'rejected':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
            default:
                return <Clock className="h-4 w-4 sm:h-5 sm:w-5" />;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-1 sm:gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Payment</span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Payment Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg space-y-4">
                        {/* Payment Method */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-base">Payment Method</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium capitalize">{paymentInfo.method}</span>
                            </div>
                        </div>

                        {/* Payment Status */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    {getStatusIcon(paymentInfo.status)}
                                </div>
                                <h4 className="font-semibold text-base">Payment Status</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium capitalize ${getStatusColor(paymentInfo.status)}`}>
                                    {paymentInfo.status}
                                </span>
                            </div>
                        </div>

                        {/* Payment Proof */}
                        {paymentInfo.proof && (
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                                            <path d="M4 16L8.58579 11.4142C9.36683 10.6332 10.6332 10.6332 11.4142 11.4142L16 16M14 14L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h4 className="font-semibold text-base">Payment Proof</h4>
                                </div>
                                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-gray-200">
                                    <Image
                                        src={paymentInfo.proof}
                                        alt="Payment Proof"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 