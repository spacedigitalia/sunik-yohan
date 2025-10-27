"use client"

import React from 'react'

import { motion } from 'framer-motion'

import { useInView } from 'framer-motion'

import { useRef } from 'react'

import { ServicesData } from "@/components/content/services/types/services"

import Image from 'next/image'

import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

import varcha1 from "@/base/assets/Rectangle1.png"

import varcha2 from "@/base/assets/Rectangle3.png"

export default function Services({ serviceData }: { serviceData: ServicesData[] }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const containerVariants = {
        hidden: { y: 50 },
        visible: {
            y: 0,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 50 },
        visible: {
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    return (
        <section className='relative py-8 sm:py-12 md:py-16 bg-white overflow-hidden'>
            <div className="container relative px-4 md:px-10">
                {/* Header Section */}
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className='max-w-3xl mx-auto text-center mb-10 sm:mb-16 md:mb-20'
                >
                    <motion.p
                        variants={itemVariants}
                        className='text-sm sm:text-base md:text-lg text-[#FF204E] leading-relaxed font-medium'
                    >
                        Layanan Kami
                    </motion.p>

                    <motion.h1
                        variants={itemVariants}
                        className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] mt-2 sm:mt-3 mb-4 sm:mb-6'
                    >
                        Kami Hadir untuk Kenyamanan dan Kepuasan Anda
                    </motion.h1>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
                >
                    {serviceData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                        >
                            <Card
                                className='group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2'
                            >
                                {/* Image Container */}
                                <div className='relative w-full aspect-[4/3] sm:aspect-[4/3] overflow-hidden'>
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        priority={idx < 3}
                                    />
                                </div>

                                {/* Content */}
                                <CardContent className='p-4 sm:p-5 md:p-6'>
                                    <CardTitle className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-[#FF204E] transition-colors duration-300'>
                                        {item.title}
                                    </CardTitle>
                                    <CardDescription className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                                        {item.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="absolute top-20 left-2 transform block"
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
                    className="absolute top-0 right-2 transform block"
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
            </div>
        </section>
    )
}
