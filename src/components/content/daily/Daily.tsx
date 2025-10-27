"use client"

import React from 'react'

import Link from "next/link"

import { DailySchedule } from "@/components/content/daily/types/daily"

import { motion } from 'framer-motion'

import varcha1 from "@/base/assets/Rectangle1.png"

import Image from 'next/image'

import varcha2 from "@/base/assets/Rectangle3.png"

export default function Daily({ dailyData }: { dailyData: DailySchedule[] }) {
    return (
        <section className='py-8 sm:py-12 md:py-16 lg:py-20 from-white to-gray-50 border-t border-gray-100 relative overflow-hidden'>
            <div className='container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto'>
                <div className='flex flex-col items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-10 md:mb-16'>
                    <motion.span
                        className='text-sm sm:text-base md:text-lg text-[#FF204E] leading-relaxed font-medium'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.5
                        }}
                    >
                        Kunjungi Kami
                    </motion.span>
                    <motion.h3
                        className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center font-bold text-[#333333] mt-1 sm:mt-2 md:mt-3 mb-2 sm:mb-4 md:mb-6 max-w-lg'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.2
                        }}
                    >
                        Lokasi Dan Jam Buka kami
                    </motion.h3>
                </div>

                <div className='flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12'>
                    <div className='w-full lg:w-1/2 relative'>
                        <motion.div
                            className='absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 flex items-center justify-between rounded-t-lg z-10'
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.5
                            }}
                        >
                            <div className='flex items-center'>
                                <motion.span
                                    className='font-medium text-gray-800'
                                    initial={{ opacity: 0 }}
                                    whileInView={{
                                        opacity: 1
                                    }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.2
                                    }}
                                >
                                    Google Maps
                                </motion.span>
                            </div>
                            <Link href="https://maps.app.goo.gl/zwyPNFP6VdHdJvMi9">
                                <motion.button
                                    className='bg-gray-900 hover:bg-gray-800 text-white text-xs px-4 py-1.5 rounded-full transition-colors duration-200'
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.3
                                    }}
                                >
                                    Directions
                                </motion.button>
                            </Link>
                        </motion.div>
                        <motion.div
                            className='w-full h-[400px] md:h-[500px] relative rounded-lg overflow-hidden shadow-lg'
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{
                                opacity: 1,
                                scale: 1
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.6
                            }}
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!4v1749320088765!6m8!1m7!1sg99tOCxGYjYk3iDXv4Oxew!2m2!1d-6.564741844724457!2d106.6840749677068!3f229.52!4f-22.010000000000005!5f0.4000000000000002"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </motion.div>
                    </div>
                    <div className='w-full lg:w-1/2'>
                        <motion.div
                            className='bg-gray-50 p-8 rounded-lg shadow-sm'
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{
                                opacity: 1,
                                x: 0
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.6
                            }}
                        >
                            <motion.h3
                                className='text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Jam Buka
                            </motion.h3>
                            <ul className='space-y-4'>
                                {dailyData
                                    .sort((a, b) => {
                                        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
                                        return days.indexOf(a.title) - days.indexOf(b.title);
                                    })
                                    .map((schedule, index) => (
                                        <motion.li
                                            key={schedule.id}
                                            className='flex justify-between items-center text-gray-600 hover:bg-gray-100 p-2 rounded-md transition-colors duration-200'
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{
                                                opacity: 1,
                                                x: 0
                                            }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1
                                            }}
                                        >
                                            <div className='flex items-center gap-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className='text-base font-medium'>{schedule.title}</span>
                                            </div>
                                            <span className='border-b border-gray-200 flex-grow mx-4'></span>
                                            <span className='text-base font-medium'>{schedule.times}</span>
                                        </motion.li>
                                    ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>

            <motion.div
                className="absolute top-12 left-4 sm:left-56 transform block"
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
                className="absolute bottom-5 right-4 sm:right-20 transform block"
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
                        src={varcha2}
                        alt='varchar'
                        className="relative w-6 h-6"
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}
