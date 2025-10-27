"use client"

import React from 'react'

import { HomeData } from '@/components/content/home/types/home'

import Image from 'next/image'

import { Button } from '@/components/ui/button'

import Link from "next/link"

import { motion } from 'framer-motion'

import varcha1 from "@/base/assets/Rectangle1.png"

export default function Home({ homeData }: { homeData: HomeData[] }) {

    return (
        <section className='relative flex flex-col items-center justify-center min-h-screen py-16 lg:py-20 bg-white overflow-hidden' id='menu'>
            <div className="container relative px-4 md:px-10">
                {homeData.map((Item, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 lg:gap-16 py-6 sm:py-8 md:py-12 lg:py-16"
                    >
                        <div
                            className="flex-1 space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 text-center lg:text-left px-2 sm:px-4 lg:px-0"
                        >
                            <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
                                <motion.h3
                                    className='px-4 sm:px-6 py-3 sm:py-4 bg-[#ffe9de] w-fit mx-auto lg:mx-0 rounded-full flex gap-2 text-sm sm:text-base md:text-lg text-[#FF204E]'
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                                >
                                    {Item.text}
                                    <picture>
                                        <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif" alt="👋" width="20" height="20" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                    </picture>
                                </motion.h3>

                                <div className='flex flex-wrap gap-2 capitalize max-w-2xl sm:max-w-3xl mx-auto lg:mx-0'>
                                    <motion.h1
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight tracking-tight"
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.8, delay: idx * 0.3 }}
                                    >
                                        {Item.title} <span className='text-[#FF204E]'>{Item.span}</span>
                                    </motion.h1>
                                </div>

                                <motion.p
                                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto lg:mx-0 leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.6, delay: idx * 0.4 }}
                                >
                                    {Item.description}
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: idx * 0.5 }}
                                className="flex justify-center lg:justify-start"
                            >
                                <Link href={Item.button.href}>
                                    <Button className='group relative px-6 sm:px-8 py-6 md:py-7 lg:py-8 text-sm sm:text-base md:text-lg lg:text-xl font-semibold bg-gradient-to-r from-[#FF204E] to-[#FF204E] text-white rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF204E]/40'>
                                        <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                            {Item.button.label}
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF204E] to-[#FF204E] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        <div
                            className="flex-1 relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-xl mx-auto lg:mx-0 mt-6 sm:mt-8 lg:mt-0"
                        >
                            <motion.div
                                className="absolute top-0 right-auto md:right-0 left-0 md:left-auto transform block"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{
                                    duration: 0.8
                                }}
                            >
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -20, 0, -20, 0],
                                        rotate: [0, 5, 0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.25, 0.5, 0.75, 1]
                                    }}
                                >
                                    <Image
                                        src={varcha1}
                                        alt='varchar'
                                        className="relative w-6 h-6"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="relative aspect-square w-full overflow-hidden"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: idx * 0.3 }}
                            >
                                <Image
                                    src={Item.imageUrl}
                                    alt={Item.title}
                                    fill
                                    className="object-cover"
                                    quality={100}
                                    priority
                                />
                            </motion.div>

                            <motion.div
                                className="absolute bottom-10 -right-5 transform block"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{
                                    duration: 0.8
                                }}
                            >
                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, -20, 0, -20, 0],
                                        rotate: [0, 5, 0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.25, 0.5, 0.75, 1]
                                    }}
                                >
                                    <Image
                                        src={varcha1}
                                        alt='varchar'
                                        className="relative w-6 h-6"
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
