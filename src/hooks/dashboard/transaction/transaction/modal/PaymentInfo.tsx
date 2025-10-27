import React from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface PaymentInfoProps {
    paymentInfo: {
        method: string;
        proof: string;
        status: string;
    }
}

export default function PaymentInfo({ paymentInfo }: PaymentInfoProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Info className="h-4 w-4" />
                    <span className="text-sm">Payment Info</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Payment Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Payment Method</h4>
                        <p className="text-sm text-gray-500 capitalize">{paymentInfo.method}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Payment Status</h4>
                        <p className="text-sm text-gray-500 capitalize">{paymentInfo.status}</p>
                    </div>

                    {paymentInfo.proof && (
                        <div className="space-y-2">
                            <h4 className="font-medium">Payment Proof</h4>
                            <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src={paymentInfo.proof}
                                    alt="Payment Proof"
                                    fill
                                    sizes="(max-width: 425px) 100vw, 425px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
