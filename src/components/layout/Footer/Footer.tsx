"use client"

import Image from "next/image";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useState } from "react";

import Logo from "@/base/assets/logo.png";

import { socialMedia, menuHamburger } from "@/components/layout/Header/data/Header";

import LoadingOverlay from "@/base/helper/LoadingOverlay";

export default function Footer() {
    const router = useRouter();
    const [trackingId, setTrackingId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const handleTrackingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            setIsLoading(true);
            setLoadingProgress(0);

            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setLoadingProgress(progress);

                if (progress >= 100) {
                    clearInterval(interval);
                    router.push(`/tracking/${trackingId.trim()}`);
                }
            }, 100);
        }
    };

    return (
        <footer className="py-8 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
            <LoadingOverlay
                isLoading={isLoading}
                message="Loading tracking information..."
                progress={loadingProgress}
            />
            <div className="container mx-auto px-4 sm:px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Logo Section */}
                    <div className="flex flex-col items-start gap-3">
                        <div className="flex items-center gap-3">
                            <Image
                                src={Logo}
                                alt="Fudo Logo"
                                width={40}
                                height={40}
                                className="object-contain rounded-lg shadow-sm"
                            />
                            <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Sunik Yohan</span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed mt-4 max-w-xs">
                            Our job is to filling your tummy with delicious food and with fast and free delivery.
                        </p>
                        {/* Social Media */}
                        <div className="flex gap-6 md:gap-10 mt-4 md:mt-6">
                            {socialMedia.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-red-500 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                                >
                                    <item.icon className="text-xl md:text-2xl" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-8 md:mt-0">
                        <h4 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">Navigation</h4>
                        <ul className="space-y-3 md:space-y-4">
                            {menuHamburger.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-600 hover:text-red-500 text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tracking Pesanan Section */}
                    <div className="mt-8 md:mt-0">
                        <h4 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">Tracking Pesanan</h4>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4 md:mb-6">
                            Masukkan nomor pesanan Anda<br />untuk melacak status pesanan
                        </p>
                        <form className="relative" onSubmit={handleTrackingSubmit}>
                            <input
                                type="text"
                                placeholder="Nomor Pesanan"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                className="w-full px-4 md:px-5 py-3 md:py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm pr-12 md:pr-14 shadow-sm transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full p-2 md:p-2.5 hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-100">
                    <p className="text-center text-xs md:text-sm text-gray-500 font-medium">
                        © 2025{' '}
                        Sunik Yohan
                        . All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}