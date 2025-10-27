"use client"

import React, { useState } from 'react'

import { z } from "zod"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import Link from 'next/link'

import bg from "@/base/assets/login.jpg"

import Image from 'next/image'

import { useAuth } from '@/utils/context/AuthContext'

const forgotPasswordSchema = z.object({
    email: z.string().email("Email tidak valid"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordLayout() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { forgotPassword } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setIsSubmitting(true);
            await forgotPassword(data.email);
            setIsSuccess(true);
        } catch (error) {
            console.error('Password reset request error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-[#f8f9fa] to-[#e8f4f8]">
            {/* Left: Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 order-2 md:order-1">
                <div className="w-full max-w-xl p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-700">Sunik Yohan</span>
                        <span className="text-xs text-gray-400">Lupa Kata Sandi</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Reset Kata Sandi</h1>
                    <p className="text-gray-500 mb-6">
                        {isSuccess
                            ? "Link reset kata sandi telah dikirim ke email Anda. Silakan cek email Anda untuk melanjutkan."
                            : "Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi Anda."}
                    </p>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
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
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-4 text-lg shadow-md hover:from-blue-500 hover:to-blue-600 cursor-pointer"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Memproses...' : 'Kirim Link Reset'}
                                    </Button>

                                    <Link
                                        href="/signin"
                                        className="block w-full text-center rounded-full border border-gray-300 text-gray-700 font-bold py-3 text-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Kembali ke Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Link Reset Terkirim!</h2>
                                <p className="text-gray-600 mb-4">
                                    Kami telah mengirimkan link reset password ke email Anda.
                                    Silakan cek folder inbox atau spam Anda.
                                </p>
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-blue-700">
                                        Link reset password akan kadaluarsa dalam 24 jam.
                                        Jika Anda tidak menerima email, silakan coba kirim ulang.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => setIsSuccess(false)}
                                    className="w-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-3 text-lg shadow-md hover:from-blue-500 hover:to-blue-600 cursor-pointer"
                                >
                                    Kirim Ulang
                                </Button>
                                <Link
                                    href="/signin"
                                    className="block w-full rounded-full border border-gray-300 text-gray-700 font-bold py-3 text-lg hover:bg-gray-50 transition-colors"
                                >
                                    Kembali ke Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-1/2 relative h-[300px] md:h-auto flex items-center justify-center order-1 md:order-2">
                <Image
                    src={bg}
                    alt="Background"
                    className="rounded-b-3xl md:rounded-l-3xl md:rounded-br-none z-0"
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-black/50 rounded-b-3xl md:rounded-l-3xl md:rounded-br-none z-10" />
            </div>
        </section>
    )
} 