"use client"

import React from 'react'

import Image from 'next/image'

import Link from 'next/link'

import { IoIosArrowForward } from 'react-icons/io'

import { motion, useScroll, useTransform } from 'framer-motion'

import banner from '@/base/assets/bg.png'

export default function HeroTransaction() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
            <motion.div
                className="absolute inset-0"
                style={{ y }}
            >
                <Image
                    src={banner}
                    alt="banner"
                    className='w-full h-[120%] object-cover'
                    priority
                />
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10"
                    style={{ opacity }}
                >
                    <h3 className='text-4xl md:text-6xl font-bold text-title tracking-tight'>Transaction</h3>
                    <div className="flex items-center gap-3 bg-[#000000]/20 px-6 py-2.5 rounded-full backdrop-blur-md">
                        <Link href="/" className='text-sm md:text-base text-white hover:text-primary transition-all duration-300'>
                            Home
                        </Link>
                        <IoIosArrowForward className="text-white text-sm" />
                        <span className='text-sm md:text-base text-white/90'>Transaction</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}