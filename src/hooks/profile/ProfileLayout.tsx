"use client";

import { useAuth } from "@/utils/context/AuthContext";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { User, Mail, Phone, ChevronLeft, MapPin } from "lucide-react";

import { Timestamp } from "firebase/firestore";

import Link from "next/link";

interface Address {
    addressType: string;
    city: string;
    createdAt: string;
    fullName: string;
    isPrimary: boolean;
    landmark: string;
    location: {
        address: string;
        city: string;
        lat: number;
        lng: number;
        postalCode: string;
        province: string;
    };
    phone: string;
    postalCode: string;
    province: string;
    streetName: string;
}

interface UserAccount {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    createdAt: Timestamp | string;
    updatedAt: Timestamp | string;
    addresses?: Address[];
}

export default function ProfileLayout() {
    const { user } = useAuth() as { user: UserAccount | null };
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/signin");
            return;
        }
    }, [user, router]);

    if (!user) return null;

    const formatDate = (date: Timestamp | string) => {
        if (date instanceof Timestamp) {
            return date.toDate().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'Asia/Jakarta'
            });
        }
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Jakarta'
        });
    };

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-between mb-6 sm:mb-10">
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Left Column - Profile Overview */}
                <div className="flex-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Overview</CardTitle>
                            <CardDescription>User information and actions</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 sm:pt-8 relative">
                            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                                <Avatar className="w-28 h-28 sm:w-36 sm:h-36 mb-4 sm:mb-5 ring-4 ring-primary/10 shadow-md">
                                    {user.photoURL ? (
                                        <AvatarImage src={user.photoURL} className="object-cover" alt={user.displayName || 'User'} />
                                    ) : (
                                        <AvatarFallback className="text-4xl sm:text-5xl bg-primary/5">
                                            {user.displayName?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{user.displayName}</h2>
                                <p className="text-base sm:text-lg text-gray-600">{user.email}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-gray-50/80 rounded-xl mb-6 sm:mb-8 shadow-sm">
                                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                    <p className="text-sm sm:text-base text-gray-600 mb-1">Member Since</p>
                                    <p className="text-base sm:text-lg font-semibold text-gray-900">
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                                    <p className="text-sm sm:text-base text-gray-600 mb-1">Last Updated</p>
                                    <p className="text-base sm:text-lg font-semibold text-gray-900">
                                        {formatDate(user.updatedAt || user.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center mb-6 sm:mb-0 sm:absolute sm:top-6 sm:right-6">
                                <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-xl shadow-sm">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-base sm:text-lg font-medium text-green-700">Verified Account</p>
                                        <p className="text-sm text-green-600">Email verified</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-2.5 bg-primary/10 rounded-lg">
                                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Display Name</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-900">{user.displayName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-2.5 bg-primary/10 rounded-lg">
                                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Email Address</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-900">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-2.5 bg-primary/10 rounded-lg">
                                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                                        <p className="text-base sm:text-lg font-medium text-gray-900">{user.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>

                                {user?.addresses && user.addresses.find((addr: Address) => addr.isPrimary) && (
                                    <div className="flex items-start gap-3 p-4 bg-gray-50/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-2.5 bg-primary/10 rounded-lg">
                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Primary Address</p>
                                            <div className="text-base sm:text-lg">
                                                <p className="font-medium text-gray-900">{user.addresses.find((addr: Address) => addr.isPrimary)?.fullName}</p>
                                                <p className="text-gray-700">{user.addresses.find((addr: Address) => addr.isPrimary)?.streetName}</p>
                                                <p className="text-gray-700">{user.addresses.find((addr: Address) => addr.isPrimary)?.landmark}</p>
                                                <p className="text-gray-700">{user.addresses.find((addr: Address) => addr.isPrimary)?.city}, {user.addresses.find((addr: Address) => addr.isPrimary)?.province} {user.addresses.find((addr: Address) => addr.isPrimary)?.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            {/* Footer content here */}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
} 