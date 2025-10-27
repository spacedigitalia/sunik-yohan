"use client"

import React, { Fragment, useEffect, useState } from 'react'

import { ProductsData } from "@/components/content/products/types/products"

import { BannerData } from "@/hooks/(pages)/products/banner/types/banner"

import Image from 'next/image'

import Link from 'next/link'

import { motion, AnimatePresence } from 'framer-motion'

import { ChevronLeft, ChevronRight, Loader2, Star } from 'lucide-react'

import { useCart } from '@/utils/context/CartContext'

import { useAuth } from '@/utils/context/AuthContext'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { CartItem } from '@/utils/context/CartContext'

import { Button } from '@/components/ui/button'

import { Pagination } from "@/components/ui/pagination"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import LoadingOverlay from '@/base/helper/LoadingOverlay'

export default function ProductsLayout({ productsData, bannerData }: { productsData: ProductsData[], bannerData: BannerData[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [selectedSize, setSelectedSize] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [activeProductId, setActiveProductId] = useState<string | null>(null)
    const [isNavigating, setIsNavigating] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const itemsPerPage = 12
    const { addToCart, loadingProductId } = useCart()
    const { user } = useAuth()
    const router = useRouter()

    // Initialize data safely
    useEffect(() => {
        try {
            if (productsData && productsData.length > 0) {
                // Set initial active product
                setActiveProductId(productsData[0].id)
            }
        } catch (error) {
            console.error('Error initializing products:', error)
        }
    }, [productsData])

    useEffect(() => {
        if (!isHovered) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % bannerData.length)
            }, 5000)
            return () => clearInterval(timer)
        }
    }, [isHovered, bannerData.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % bannerData.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + bannerData.length) % bannerData.length)
    }

    const filteredProducts = React.useMemo(() => {
        if (!productsData) return []

        return selectedCategory === 'All'
            ? productsData
            : productsData.filter(product => {
                const categoryMatch = product.category === selectedCategory;
                if (selectedCategory === 'Minuman' && selectedSize !== 'all') {
                    return categoryMatch && product.size === selectedSize;
                }
                return categoryMatch;
            });
    }, [productsData, selectedCategory, selectedSize]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProducts = filteredProducts.slice(startIndex, endIndex)

    // Update active product when current products change
    useEffect(() => {
        if (currentProducts.length > 0 && !activeProductId) {
            setActiveProductId(currentProducts[0].id)
        }
    }, [currentProducts, activeProductId])

    const categories = ['All', ...new Set(productsData.map(item => item.category))]

    const handleAddToCart = (product: Omit<CartItem, 'quantity'>) => {
        if (!user) {
            // Show message first
            toast.info('Silakan login terlebih dahulu untuk menambahkan ke keranjang')

            // Wait for 1.5 seconds before redirecting
            setTimeout(() => {
                // Save the current URL to redirect back after login
                localStorage.setItem('redirectAfterLogin', window.location.pathname)
                router.push('/signin')
            }, 1500)
            return
        }
        addToCart(product)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Scroll to top of products section
        const productsSection = document.getElementById('products-section')
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

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
        <Fragment>
            {/* Banner */}
            <div className='min-h-auto md:min-h-[50vh] container px-4 md:px-8 relative overflow-hidden pt-24'>
                <div
                    className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-xl md:rounded-2xl shadow-xl"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={bannerData[currentIndex].imageUrl}
                                alt='banner_image'
                                quality={100}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8"
                    >
                        <button
                            onClick={prevSlide}
                            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
                    >
                        {bannerData.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${idx === currentIndex
                                    ? 'bg-white w-10 md:w-16 opacity-100'
                                    : 'bg-white/50 w-6 md:w-10 opacity-60 hover:opacity-80'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                                style={{ minWidth: '1.5rem' }}
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-white/50"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        key={currentIndex}
                    />
                </div>
            </div>

            {/* Products Populer */}
            <section className='pt-12 md:pt-20'>
                <div className='container px-4 md:px-8'>
                    <div className="mb-8 md:mb-12">
                        <h2 className='text-3xl md:text-4xl font-bold relative'>
                            Produk Terbaik
                            <div className="absolute -bottom-2 left-0 w-20 md:w-24 h-1 bg-gradient-to-r from-black to-black rounded-full"></div>
                        </h2>
                    </div>

                    <div className="w-full">
                        <style jsx>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide">
                            {productsData
                                .filter(product => product.ratings && product.ratings !== "null")
                                .sort((a, b) => {
                                    const ratingA = parseFloat(a.ratings || "0");
                                    const ratingB = parseFloat(b.ratings || "0");
                                    return ratingB - ratingA;
                                })
                                .slice(0, 6)
                                .map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                                        className='group bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex-shrink-0 w-[250px] md:w-[300px]'
                                    >
                                        <div className='grid grid-cols-1 gap-4'>
                                            <div className='relative aspect-square w-full overflow-hidden'>
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    quality={100}
                                                    fill
                                                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                                                />
                                                <div className='absolute right-0 bottom-0 p-2 rounded-tl-2xl bg-white'>
                                                    <button
                                                        className='text-black rounded-full p-3 transition-colors duration-300 cursor-pointer'
                                                        onClick={() => handleAddToCart({
                                                            id: item.id,
                                                            title: item.title,
                                                            price: item.price,
                                                            thumbnail: item.thumbnail
                                                        })}
                                                        disabled={loadingProductId === item.id}
                                                    >
                                                        {loadingProductId === item.id ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <svg
                                                                className="w-6 h-6"
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
                                                        )}
                                                    </button>
                                                </div>
                                                <div className='absolute left-0 bottom-0 px-4 py-2 bg-white rounded-tr-2xl'>
                                                    {item.size && item.size !== "null" && (
                                                        <p className='text-gray-600 text-sm line-clamp-2'>Size : {item.size}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='p-6'>
                                                <h3 className='font-bold text-xl mb-2 line-clamp-1'>{item.title}</h3>
                                                <div className='flex items-center justify-between mb-4'>
                                                    <span className='font-bold text-lg text-gray-600'>Rp. {item.price}</span>
                                                    <div className='flex items-center gap-1'>
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        <span className='font-medium'>{item.ratings}</span>
                                                    </div>
                                                </div>
                                                <Link href={`/products/${item.slug}`} onClick={(e) => handleProductClick(e, item.slug, item.title)} className='w-full'>
                                                    <Button className='w-full'>Lihat Details</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* All Products */}
            <section id="products-section" className='min-h-full py-10 bg-gray-50'>
                <div className="container px-4 md:px-8">
                    <div className="mb-6 sm:mb-12 overflow-x-auto pb-2">
                        <div className='flex justify-between items-start md:items-center flex-col md:flex-row gap-4'>
                            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight tracking-tight'>Product Kami</h1>

                            <div className='flex items-center flex-col md:flex-row gap-2 w-full md:w-auto'>
                                <div className="flex items-center justify-start gap-1 sm:gap-2 p-1 bg-secondary/20 dark:bg-secondary/10 rounded-xl border border-border w-full md:w-fit overflow-x-auto scrollbar-hide">
                                    {categories.map((category) => (
                                        <motion.button
                                            key={category}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: categories.indexOf(category) * 0.1 }}
                                            className={`relative px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors duration-200 capitalize cursor-pointer ${selectedCategory === category
                                                ? 'text-primary-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {selectedCategory === category && (
                                                <motion.div
                                                    layoutId="activeYoutubeCategory"
                                                    className="absolute inset-0 bg-[#FF204E] rounded-lg"
                                                    initial={false}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30
                                                    }}
                                                />
                                            )}
                                            <span className="relative z-10">{category}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                {selectedCategory === 'Minuman' && (
                                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                                        <SelectTrigger className="w-full md:w-[180px]">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Sizes</SelectItem>
                                            {[...new Set(productsData
                                                .filter(item => item.category === 'Minuman')
                                                .map(item => item.size)
                                                .filter(size => size !== null && size !== undefined && size !== "null"))]
                                                .map((size, idx) => (
                                                    <SelectItem key={idx} value={size || ''}>
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
                        {currentProducts.map((item, idx) => (
                            <div
                                key={idx}
                                className={`group bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${activeProductId === item.id ? 'ring-2 ring-[#FF204E]' : ''
                                    }`}
                                onClick={() => setActiveProductId(item.id)}
                            >
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='p-4 md:p-6 order-2 md:order-1'>
                                        <h3 className='font-bold text-lg md:text-xl mb-2 line-clamp-1'>{item.title}</h3>

                                        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{item.description}</p>

                                        <div className='flex items-center justify-between'>
                                            <span className='font-bold text-base md:text-lg text-gray-600'>Rp. {item.price}</span>
                                        </div>

                                        <div className='mt-6 md:mt-8 flex gap-3'>
                                            <Link href={`/products/${item.slug}`} onClick={(e) => handleProductClick(e, item.slug, item.title)} className='flex-1'>
                                                <Button className='w-full text-sm md:text-base'>Lihat Details</Button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className='relative aspect-square w-full overflow-hidden order-1 md:order-2'>
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            quality={100}
                                            fill
                                            className='object-cover group-hover:scale-105 transition-transform duration-300'
                                        />

                                        <div className='absolute right-0 bottom-0 p-2 rounded-tl-2xl bg-white'>
                                            <button className=' text-black rounded-full p-3 transition-colors duration-300 cursor-pointer' onClick={() => handleAddToCart({
                                                id: item.id,
                                                title: item.title,
                                                price: item.price,
                                                thumbnail: item.thumbnail
                                            })}
                                                disabled={loadingProductId === item.id}>
                                                {loadingProductId === item.id ? (
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <svg
                                                        className="w-6 h-6"
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
                                                )}
                                            </button>
                                        </div>

                                        <div className='absolute left-0 bottom-0'>
                                            {
                                                item.size && item.size !== "null" && (
                                                    <div className='px-4 py-2 bg-white rounded-tr-2xl'>
                                                        <p className='text-gray-600 text-sm line-clamp-2'>Size: {item.size}</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-10 flex gap-4 justify-between items-center flex-col md:flex-row">
                            <span className="text-sm text-muted-foreground ml-2">
                                Menu {currentPage} of {totalPages}
                            </span>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </section>

            <LoadingOverlay
                isLoading={!!loadingId || loadingProgress > 0}
                message={`Loading ${productsData.find(p => p.slug === loadingId)?.title || 'product'} details...`}
                progress={loadingProgress}
            />
        </Fragment>
    )
}
