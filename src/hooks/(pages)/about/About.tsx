"use client"

import React, { Fragment, useState } from 'react'

import { AboutData } from '@/hooks/(pages)/about/types/about'

import { testimonialsData } from '@/hooks/(pages)/about/types/testimonials'

import { AppsData } from '@/hooks/(pages)/about/types/apps'

import Image from 'next/image'

import { motion, AnimatePresence } from 'framer-motion'

import Link from 'next/link'

export default function About({
    aboutData,
    testimonialsData,
    appsData
}: {
    aboutData: AboutData[],
    testimonialsData: testimonialsData[],
    appsData: AppsData[]
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) =>
            prev === testimonialsData.length - 1 ? 0 : prev + 1
        );
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? testimonialsData.length - 1 : prev - 1
        );
    };

    return (
        <Fragment>
            <section className="bg-white py-8 sm:py-12 md:py-20 overflow-hidden">
                <div className="container px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-20">
                        {/* Left Section - Image */}
                        <div className="w-full lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative transform hover:scale-105 transition-transform duration-300"
                            >
                                <Image
                                    src={aboutData[0]?.imageUrl || "/images/chef.png"}
                                    alt="Chef"
                                    width={500}
                                    height={500}
                                    className="relative z-10 rounded-lg w-full h-auto"
                                />
                            </motion.div>
                        </div>

                        {/* Right Section - Content and Testimonials */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="text-red-500 font-bold mb-2 md:mb-3 tracking-wider text-sm md:text-base"
                            >
                                {aboutData[0]?.title}
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 md:mb-8 leading-tight"
                            >
                                {aboutData[0]?.description}
                            </motion.h2>

                            {/* Testimonials Slider */}
                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className="mb-6 md:mb-10"
                                    >
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                            className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed italic"
                                        >
                                            "{testimonialsData[currentIndex]?.message}"
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="flex items-center justify-center lg:justify-start mb-4 md:mb-6"
                                        >
                                            <Image
                                                src={testimonialsData[currentIndex]?.imageUrl}
                                                alt={testimonialsData[currentIndex]?.name}
                                                width={50}
                                                height={50}
                                                className="rounded-full mr-3 md:mr-4 w-12 h-12 md:w-14 md:h-14"
                                            />
                                            <div>
                                                <motion.p
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5 }}
                                                    className="font-bold text-gray-800 text-base md:text-lg lg:text-xl"
                                                >
                                                    {testimonialsData[currentIndex]?.name}
                                                </motion.p>
                                                <motion.p
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: 0.1 }}
                                                    className="text-gray-500 text-xs md:text-sm mt-1"
                                                >
                                                    {testimonialsData[currentIndex]?.job}
                                                </motion.p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="flex justify-center lg:justify-start gap-3 md:gap-4 mt-6 md:mt-8">
                                    <button
                                        onClick={prevTestimonial}
                                        className="p-2 md:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:shadow-md"
                                        aria-label="Previous testimonial"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextTestimonial}
                                        className="p-2 md:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:shadow-md"
                                        aria-label="Next testimonial"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Apps */}
            <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16 lg:py-20 relative overflow-hidden">
                <div className="container px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24">
                        {/* Left Section - Download App Content */}
                        <div className="text-center lg:text-left">
                            <div className="space-y-4 md:space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-50 rounded-full"
                                >
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></span>
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="text-red-500 font-bold tracking-wider uppercase text-xs md:text-sm"
                                    >
                                        {appsData[0]?.text}
                                    </motion.p>
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight"
                                >
                                    {appsData[0]?.title}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0"
                                >
                                    {appsData[0]?.description}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
                                >
                                    <Link href={appsData[0]?.button.href}>
                                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base">
                                            {appsData[0]?.button.label}
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right Section - Mobile App Content */}
                        <div className="flex flex-col items-center lg:items-start">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-md"
                            >
                                <div className="absolute -inset-3 md:-inset-4 bg-gradient-to-r from-red-100 to-red-50 rounded-3xl transform rotate-3"></div>
                                <div className="absolute -inset-3 md:-inset-4 bg-gradient-to-l from-red-100 to-red-50 rounded-3xl transform -rotate-3"></div>
                                <Image
                                    src={appsData[0]?.imageUrl || "/images/mobile-app.png"}
                                    alt="Mobile App Illustration"
                                    width={400}
                                    height={600}
                                    className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full opacity-60 blur-2xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-tr from-red-50 to-red-100 rounded-full opacity-50 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-4xl opacity-20 animate-float">😊</div>
                <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-3xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🔥</div>
                <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 text-3xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>✨</div>

                {/* Gradient Dots */}
                <div className="absolute top-1/2 right-1/2 w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full opacity-30 blur-sm animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-gradient-to-r from-red-300 to-red-400 rounded-full opacity-30 blur-sm animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute top-1/4 left-1/3 w-5 h-5 bg-gradient-to-r from-red-200 to-red-300 rounded-full opacity-30 blur-sm animate-pulse" style={{ animationDelay: '1.2s' }}></div>

                {/* Wave Patterns */}
                <div className="absolute top-1/4 right-0 text-red-300 text-9xl opacity-10 z-0 animate-wave">~~~</div>
                <div className="absolute bottom-1/3 right-0 text-red-300 text-9xl opacity-10 z-0 animate-wave" style={{ animationDelay: '0.3s' }}>~~~</div>
                <div className="absolute top-2/3 left-0 text-red-300 text-9xl opacity-10 z-0 animate-wave" style={{ animationDelay: '0.7s' }}>~~~</div>

                {/* Add keyframes for animations */}
                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes wave {
                        0%, 100% { transform: translateX(0); }
                        50% { transform: translateX(-10px); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    .animate-wave {
                        animation: wave 8s ease-in-out infinite;
                    }
                `}</style>
            </section>
        </Fragment>
    )
}

