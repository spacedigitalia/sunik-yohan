"use client"

import React, { useState, useRef, useEffect } from 'react'

import Image from 'next/image'

import { Card, CardContent, CardFooter } from "@/components/ui/card"

import { ProductsData } from '@/components/content/products/types/products'

import { ProductCategory } from './utils/FetchProducts'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import varcha1 from "@/base/assets/Rectangle1.png"

import varcha2 from "@/base/assets/Rectangle3.png"

import { motion } from 'framer-motion'

import { useCart } from '@/utils/context/CartContext'

import type { CartItem } from '@/utils/context/CartContext'

import { Loader2, Star } from "lucide-react";

import { useAuth } from '@/utils/context/AuthContext';

import { useRouter, usePathname } from 'next/navigation';

import { toast } from 'sonner';

import LoadingOverlay from '@/base/helper/LoadingOverlay';

export default function Products({ productsData }: { productsData: ProductsData[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const { addToCart, loadingProductId } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const categories: ProductCategory[] = [
        { id: 'all', title: 'All' },
        { id: 'Makanan', title: 'Makanan' },
        { id: 'Minuman', title: 'Minuman' }
    ];

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    React.useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScroll);
            // Initial check
            checkScroll();
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', checkScroll);
            }
        };
    }, []);

    // Get 10 newest products for each category
    const getNewestProducts = (category: string) => {
        return productsData
            .filter(product => product.category === category)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
    };

    const filteredProducts = selectedCategory === 'all'
        ? [...getNewestProducts('Makanan'), ...getNewestProducts('Minuman')]
        : getNewestProducts(selectedCategory);

    const handleAddToCart = (product: Omit<CartItem, 'quantity'>) => {
        if (!user) {
            // Show message first
            toast.info('Silakan login terlebih dahulu untuk menambahkan ke keranjang');

            setTimeout(() => {
                // Save the current URL to redirect back after login
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                router.push('/signin');
            }, 1500);
            return;
        }
        addToCart(product);
    };

    const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>, productSlug: string, productTitle: string) => {
        e.preventDefault();
        setLoadingId(productSlug);
        setLoadingProgress(0);
        setIsNavigating(true);

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setLoadingProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                router.push(`/products/${productSlug}`);
            }
        }, 100);
    };

    return (
        <section className='py-16 lg:py-20 bg-white relative overflow-hidden'>
            <div className="container px-4 md:px-10">
                <div className='flex flex-col sm:flex-row justify-between items-start md:items-center mb-10 sm:mb-20'>
                    <div className='flex flex-col gap-2 mb-0'>
                        <span className='text-sm sm:text-base md:text-lg text-[#FF204E] leading-relaxed font-medium'>MENU KAMI</span>
                        <h3 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mt-2 sm:mt-3 mb-4 sm:mb-6 max-w-lg'>Menu Terbaru Kami</h3>

                        <div className='flex items-center gap-4'>
                            <Link href="/products">
                                <Button className='bg-[#FF204E] text-white'>
                                    Lihat Semua Produk
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className='hidden md:block'>
                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleScroll('left')}
                                disabled={!canScrollLeft}
                                className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md transition-colors cursor-pointer ${canScrollLeft
                                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                &lt;
                            </button>
                            <button
                                onClick={() => handleScroll('right')}
                                disabled={!canScrollRight}
                                className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md transition-colors cursor-pointer ${canScrollRight
                                    ? 'bg-[#FF204E] text-white hover:bg-[#e61e4d]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Menu Categories */}
                    <div className="w-full lg:w-1/4 border-b lg:border-b-0 pb-4 lg:pb-0 lg:pr-10 mb-6 lg:mb-0">
                        <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-3">
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center p-2 lg:p-3 rounded-lg transition-colors duration-200 cursor-pointer whitespace-nowrap ${selectedCategory === category.id
                                        ? 'bg-[#FF204E] text-white relative'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {selectedCategory === category.id && (
                                        <div className="absolute top-0 -left-4 w-1 h-full bg-[#FF204E] rounded-r-full hidden lg:block"></div>
                                    )}
                                    <span className="mr-2 lg:mr-3 text-xl">
                                        {category.title === 'All' ? '🍽️' :
                                            category.title === 'Makanan' ? '🍿' :
                                                category.title === 'Minuman' ? '🥤' : '🍽️'}
                                    </span>
                                    <span className="font-medium">{category.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Food Items */}
                    <div className="w-full lg:w-3/4">
                        <style jsx>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
                        >
                            {filteredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex-shrink-0"
                                >
                                    <Card
                                        className="group w-[300px] sm:w-[400px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0
                                                }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: index * 0.1
                                                }}
                                                className="w-full h-full"
                                            >
                                                <Image
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                    fill
                                                />

                                                <div className='absolute bottom-4 left-2'>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{
                                                            opacity: 1,
                                                            y: 0
                                                        }}
                                                        viewport={{ once: true, amount: 0.3 }}
                                                        transition={{
                                                            duration: 0.5,
                                                            delay: index * 0.1 + 0.2
                                                        }}
                                                        className="flex items-center justify-center px-6 py-2 rounded-full bg-white gap-1"
                                                    >
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Rp. {product.price}
                                                        </span>
                                                    </motion.div>
                                                </div>

                                                <div className='absolute bottom-4 left-32'>
                                                    {product.ratings !== null && product.ratings !== undefined && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{
                                                                opacity: 1,
                                                                y: 0
                                                            }}
                                                            viewport={{ once: true, amount: 0.3 }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: index * 0.1 + 0.2
                                                            }}
                                                            className="flex items-center justify-center px-6 py-2 rounded-full bg-white gap-1"
                                                        >
                                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {product.ratings}
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="space-y-2">
                                                <motion.h4
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    viewport={{ once: true, amount: 0.3 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1 + 0.2
                                                    }}
                                                    className="text-xl font-bold text-[#333333] line-clamp-1"
                                                >
                                                    {product.title}
                                                </motion.h4>
                                                <motion.p
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    viewport={{ once: true, amount: 0.3 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1 + 0.3
                                                    }}
                                                    className="text-gray-600 line-clamp-2"
                                                >
                                                    {product.description}
                                                </motion.p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-6 pt-0">
                                            <div className="flex gap-3 w-full">
                                                <button
                                                    onClick={() => handleAddToCart({
                                                        id: product.id,
                                                        title: product.title,
                                                        price: product.price,
                                                        thumbnail: product.thumbnail
                                                    })}
                                                    disabled={loadingProductId === product.id}
                                                    className="inline-flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-[#FF204E] rounded-lg transition-colors duration-300 hover:bg-[#e61e4d] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingProductId === product.id ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                className="w-5 h-5 mr-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                                />
                                                            </svg>
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    onClick={(e) => handleProductClick(e, product.slug, product.title)}
                                                    className="inline-flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-[#FF204E] border-2 border-[#FF204E] rounded-lg transition-colors duration-300 hover:bg-[#FF204E] hover:text-white"
                                                >
                                                    <svg
                                                        className="w-5 h-5 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                    Details
                                                </Link>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='block md:hidden'>
                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => handleScroll('left')}
                            disabled={!canScrollLeft}
                            className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md transition-colors cursor-pointer ${canScrollLeft
                                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            &lt;
                        </button>
                        <button
                            onClick={() => handleScroll('right')}
                            disabled={!canScrollRight}
                            className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md transition-colors cursor-pointer ${canScrollRight
                                ? 'bg-[#FF204E] text-white hover:bg-[#e61e4d]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>

            <motion.div
                className="absolute top-2 right-20 transform block"
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
                className="absolute top-5 left-56 transform block"
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

            <LoadingOverlay
                isLoading={!!loadingId || loadingProgress > 0}
                message={`Loading ${productsData.find(p => p.slug === loadingId)?.title || 'product'} details...`}
                progress={loadingProgress}
            />
        </section>
    )
}
