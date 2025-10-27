import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { MapPin } from "lucide-react"

import { ShipedModalProps } from "@/types/Transaction"

export default function ShipedModal({ transaction }: ShipedModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center mb-2 justify-center gap-1 sm:gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Shipping</span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Shipping Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg space-y-4">
                        {/* Recipient Details Section */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-base">Recipient Details</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="text-sm font-medium">{transaction.shippingInfo.firstName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="text-sm text-gray-600">{transaction.shippingInfo.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path d="M3 5.5C3 14.0604 12 21 12 21C12 21 21 14.0604 21 5.5C21 4.11929 20.4142 2.80504 19.364 1.80397C18.3137 0.802903 16.9115 0.199997 15.45 0.199997C14.0885 0.199997 12.6863 0.802903 11.636 1.80397C10.5858 2.80504 10 4.11929 10 5.5C10 6.88071 10.5858 8.19496 11.636 9.19603C12.6863 10.1971 14.0885 10.8 15.45 10.8C16.9115 10.8 18.3137 10.1971 19.364 9.19603C20.4142 8.19496 21 6.88071 21 5.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15.45 7.5C16.3044 7.5 17.1237 7.15759 17.7306 6.55065C18.3376 5.94371 18.68 5.12456 18.68 4.27C18.68 3.41544 18.3376 2.59629 17.7306 1.98935C17.1237 1.38241 16.3044 1.04 15.45 1.04C14.5954 1.04 13.7763 1.38241 13.1694 1.98935C12.5624 2.59629 12.22 3.41544 12.22 4.27C12.22 5.12456 12.5624 5.94371 13.1694 6.55065C13.7763 7.15759 14.5954 7.5 15.45 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="text-sm text-gray-600">{transaction.shippingInfo.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                                        <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-base">Address</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mt-1">
                                        <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">{transaction.shippingInfo.streetName}</p>
                                        <p className="text-sm text-gray-600">
                                            {transaction.shippingInfo.city}, {transaction.shippingInfo.province} {transaction.shippingInfo.postalCode}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            RT: {transaction.shippingInfo.rt} / RW: {transaction.shippingInfo.rw}
                                        </p>
                                        {transaction.shippingInfo.landmark && (
                                            <p className="text-sm text-gray-600">
                                                Landmark: {transaction.shippingInfo.landmark}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600">
                                        <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-base">Additional Information</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                        <path d="M9 20L17 20M9 4H17M9 12H17M5 20V4M5 20H3M5 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="text-sm">
                                        Address Type: <span className="font-medium capitalize">{transaction.shippingInfo.addressType}</span>
                                    </p>
                                </div>
                                {transaction.shippingInfo.district && (
                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="text-sm">
                                            Coordinates: <span className="font-medium">{transaction.shippingInfo.district}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Map Section */}
                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600">
                                        <path d="M9 20L17 20M9 4H17M9 12H17M5 20V4M5 20H3M5 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-base">Location Map</h4>
                            </div>
                            <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200">
                                {transaction.shippingInfo.district && (
                                    <iframe
                                        title="Location Map"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(transaction.shippingInfo.district.split(',')[1]) - 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) - 0.002}%2C${parseFloat(transaction.shippingInfo.district.split(',')[1]) + 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) + 0.002}&layer=mapnik&marker=${transaction.shippingInfo.district.split(',')[0]},${transaction.shippingInfo.district.split(',')[1]}`}
                                        allowFullScreen
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
