"use client"

import React, { useState } from 'react'

import { z } from "zod"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import bg from "@/base/assets/register.webp"

import Image from 'next/image';

import Menu1 from "@/base/assets/Menu1.jpg"
import Menu2 from "@/base/assets/Menu2.jpg"
import Menu3 from "@/base/assets/Menu3.jpg"

import Link from 'next/link';

import { useAuth } from '@/utils/context/AuthContext'

const signupSchema = z.object({
    fullname: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string()
        .min(8, "Kata sandi minimal 8 karakter")
        .regex(/[A-Z]/, "Kata sandi harus mengandung huruf besar")
        .regex(/[a-z]/, "Kata sandi harus mengandung huruf kecil")
        .regex(/[0-9]/, "Kata sandi harus mengandung angka"),
    confirmPassword: z.string(),
    phoneNumber: z.string().min(10, "Nomor telepon minimal 10 karakter")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupLayout() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { signUp, loginWithGoogle } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            await signUp(data.email, data.password, data.fullname, data.phoneNumber);
        } catch (error) {
            console.error('Sign up error:', error);
        }
    };

    return (
        <section className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-[#f8f9fa] to-[#e8f4f8]">
            {/* Right: Image & UI Elements */}
            <div className="w-full md:w-1/2 relative flex items-center justify-center h-[300px] md:h-auto order-1 md:order-2">
                {/* Background Image */}
                <Image
                    src={bg}
                    alt="Background"
                    className="rounded-b-2xl rounded-l-none md:rounded-r-3xl z-0"
                    fill
                    style={{ objectFit: 'cover' }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-b-2xl rounded-l-none md:rounded-r-3xl z-10" />
                {/* Overlay */}
                <div className="relative z-20 flex flex-col gap-6 items-start p-6 md:p-12 w-full">
                    {/* Featured Drink Card */}
                    <div className="bg-blue-200 rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
                        <span className="font-semibold text-gray-800">Minuman Spesial Hari Ini</span>
                        <span className="bg-blue-400 text-xs rounded px-2 py-1 ml-2">Terbatas</span>
                    </div>
                    {/* Popular Drinks */}
                    <div className="flex items-center gap-2">
                        <Image src={Menu1} alt="minuman" className="w-10 h-10 rounded-full border-2 border-white -ml-2" />
                        <Image src={Menu2} alt="minuman" className="w-10 h-10 rounded-full border-2 border-white -ml-2" />
                        <Image src={Menu3} alt="minuman" className="w-10 h-10 rounded-full border-2 border-white -ml-2" />
                        <span className="ml-2 text-white font-semibold">+5</span>
                    </div>
                    {/* Special Offers Card */}
                    <div className="bg-white bg-opacity-80 rounded-xl p-4 shadow-md">
                        <div className="flex gap-2 mb-2">
                            <span className="text-gray-700 font-bold">Sen</span>
                            <span className="text-gray-700 font-bold">Sel</span>
                            <span className="text-gray-700 font-bold">Rab</span>
                            <span className="text-gray-700 font-bold">Kam</span>
                            <span className="text-gray-700 font-bold">Jum</span>
                            <span className="text-gray-700 font-bold">Sab</span>
                            <span className="text-gray-700 font-bold">Min</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-gray-400">15%</span>
                            <span className="text-gray-400">20%</span>
                            <span className="text-gray-900 font-bold bg-blue-200 rounded px-2">25%</span>
                            <span className="text-gray-400">15%</span>
                            <span className="text-gray-400">20%</span>
                            <span className="text-gray-400">25%</span>
                            <span className="text-gray-400">30%</span>
                        </div>
                    </div>
                    {/* Happy Hour Card */}
                    <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4">
                        <div className="bg-blue-300 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg text-gray-800">4-7</div>
                        <div>
                            <div className="font-semibold text-gray-700">Happy Hour</div>
                            <div className="text-gray-400 text-xs">Promo Sepanjang Hari</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left: Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 md:p-8 order-2 md:order-1">
                <div className="w-full max-w-xl p-4 py-6 md:py-0 md:p-10">
                    <div className="mb-8 flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-700">Sunik Yohan</span>
                        <span className="text-xs text-gray-400">Bergabung dengan kami</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Selamat Datang di Sunik Yohan</h1>
                    <p className="text-gray-500 mb-6">Daftar untuk menemukan minuman terbaik</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-1.5">
                                <Label htmlFor="fullname" className="text-sm font-semibold text-gray-700">Nama Lengkap</Label>
                                <div className="relative">
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder="Masukkan nama lengkap"
                                        {...register("fullname")}
                                        className="rounded-xl pl-12 pr-5 py-3 bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all text-base"
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                {errors.fullname && (
                                    <span className="text-red-500 text-sm">{errors.fullname.message}</span>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="contoh@email.com"
                                        {...register("email")}
                                        className="rounded-xl pl-12 pr-5 py-3 bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all text-base"
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                {errors.email && (
                                    <span className="text-red-500 text-sm">{errors.email.message}</span>
                                )}
                                <span className="text-xs text-gray-400 mt-1">Kami tidak akan membagikan email Anda.</span>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">Nomor Telepon</Label>
                                <div className="relative">
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        placeholder="Masukkan nomor telepon"
                                        {...register("phoneNumber")}
                                        className="rounded-xl pl-12 pr-5 py-3 bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all text-base"
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                {errors.phoneNumber && (
                                    <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Kata Sandi</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        className="rounded-xl pl-12 pr-12 py-3 bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all text-base"
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Konfirmasi Kata Sandi</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register("confirmPassword")}
                                        className="rounded-xl pl-12 pr-12 py-3 bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all text-base"
                                    />
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-3 text-lg shadow-md hover:from-blue-500 hover:to-blue-600 mt-2 cursor-pointer"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Mendaftar...' : 'Buat Akun'}
                            </Button>
                        </div>
                    </form>
                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-200" />
                        <span className="mx-4 text-gray-400 text-sm">atau</span>
                        <div className="flex-grow h-px bg-gray-200" />
                    </div>
                    <div className="flex gap-4 mb-4">
                        <Button
                            variant="outline"
                            className="w-full rounded-full flex items-center justify-center gap-2 cursor-pointer"
                            onClick={loginWithGoogle}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <path d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.18-1.36 3.463-5.262 3.463-3.167 0-5.75-2.624-5.75-5.85s2.583-5.85 5.75-5.85c1.805 0 3.017.77 3.71 1.43l2.537-2.47C17.13 3.77 15.167 2.7 12.625 2.7 7.83 2.7 4 6.53 4 11.325s3.83 8.625 8.625 8.625c4.975 0 8.25-3.48 8.25-8.38 0-.56-.06-1.01-.07-1.547z" fill="#4285F4" />
                                    <path d="M12.625 21.45c2.33 0 4.28-.77 5.707-2.09l-2.72-2.22c-.75.51-1.75.87-2.987.87-2.29 0-4.23-1.55-4.927-3.64H4.89v2.28A8.62 8.62 0 0 0 12.625 21.45z" fill="#34A853" />
                                    <path d="M7.698 14.37a5.19 5.19 0 0 1 0-3.29v-2.28H4.89a8.63 8.63 0 0 0 0 7.85l2.808-2.28z" fill="#FBBC05" />
                                    <path d="M12.625 7.8c1.27 0 2.13.55 2.62 1.01l1.91-1.86C15.9 5.77 14.43 5.1 12.625 5.1c-2.637 0-4.89 1.8-5.697 4.22l2.808 2.28c.7-2.09 2.64-3.64 4.89-3.64z" fill="#EA4335" />
                                </g>
                            </svg>
                            Google
                        </Button>
                    </div>
                    <div className="text-center text-gray-400 text-xs mt-4">
                        Sudah punya akun? <Link href="/signin" className="text-blue-500 font-semibold">Masuk</Link>
                    </div>
                    <div className="text-center text-gray-300 text-xs mt-2">
                        Syarat & Ketentuan
                    </div>
                </div>
            </div>
        </section>
    )
}
