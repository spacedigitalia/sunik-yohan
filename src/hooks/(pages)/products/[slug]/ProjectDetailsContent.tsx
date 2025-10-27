"use client"

import React, { useState, Fragment } from 'react'

import { ProductsData } from '@/components/content/products/types/products'

import Link from 'next/link';

import Image from 'next/image';

import ShopeFod from "@/base/assets/shofepod.png"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/utils/context/CartContext'
import type { CartItem } from '@/utils/context/CartContext'
import { Loader2, Star } from 'lucide-react'
import { useAuth } from '@/utils/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import LoadingOverlay from '@/base/helper/LoadingOverlay'

interface ProjectDetailsContentProps {
    slug: string;
    productsData: ProductsData | ProductsData[];
    allProducts: ProductsData[];
    relatedProducts?: ProductsData[];
}

export default function ProjectDetailsContent({ slug, productsData, allProducts, relatedProducts = [] }: ProjectDetailsContentProps) {
    const productsArray = Array.isArray(productsData) ? productsData : [productsData];
    const product = productsArray[0];
    const { addToCart, loadingProductId } = useCart()
    const { user } = useAuth()
    const router = useRouter()
    const [isNavigating, setIsNavigating] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)

    if (!product) {
        return <section className='min-h-screen py-12 bg-white'>Product not found</section>;
    }

    const handleAddToCart = (product: Omit<CartItem, 'quantity'>) => {
        if (!user) {
            toast.info('Silakan login terlebih dahulu untuk menambahkan ke keranjang')
            setTimeout(() => {
                localStorage.setItem('redirectAfterLogin', window.location.pathname)
                router.push('/signin')
            }, 1500)
            return
        }

        // Check stock from the product object
        const productData = productsArray[0]
        if (!productData.stock || productData.stock <= 0) {
            toast.error('Maaf, stok produk sedang kosong')
            return
        }

        if (quantity > productData.stock) {
            toast.error(`Maaf, stok hanya tersedia ${productData.stock} item`)
            return
        }

        // Add to cart with the selected quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
    }

    const handleQuantityChange = (action: 'increase' | 'decrease') => {
        if (action === 'increase' && quantity < (product.stock || 0)) {
            setQuantity(prev => prev + 1)
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1)
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
            <section className='min-h-screen py-10 md:py-20'>
                <div className="container px-4 md:px-8">
                    <div className='flex flex-col lg:flex-row gap-8 lg:gap-16'>
                        {/* Image Gallery */}
                        <div className='w-full lg:w-1/2'>
                            <div className='w-full aspect-square rounded-lg overflow-hidden bg-gray-50'>
                                <div
                                    className='w-full h-full bg-cover bg-center'
                                    style={{ backgroundImage: `url(${product.thumbnail})` }}
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className='w-full lg:w-1/2'>
                            <Card className='sticky top-24 border border-gray-100'>
                                <CardHeader className='space-y-4'>
                                    <div>
                                        <p className='text-sm text-gray-500 mb-2 uppercase tracking-wider'>{product.category}</p>
                                        <CardTitle className='text-2xl md:text-3xl font-medium text-gray-900 mb-4'>{product.title}</CardTitle>
                                        <span className='text-2xl font-medium text-gray-900'>Rp. {product.price}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className='space-y-6'>
                                    {/* Stock and Size Information */}
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        {/* Stock Card */}
                                        <Card className='border border-gray-100'>
                                            <CardContent className='p-4'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='p-2 bg-gray-50 rounded-md'>
                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Stock Available</p>
                                                        <p className='text-lg font-medium text-gray-900'>{product.stock || 0}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Sold Information */}
                                        <Card className='border border-gray-100'>
                                            <CardContent className='p-4'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='p-2 bg-gray-50 rounded-md'>
                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Total Sold</p>
                                                        <p className='text-lg font-medium text-gray-900'>{product.sold || 0}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Size Card */}
                                        {product.size && product.size !== "null" && (
                                            <Card className='border border-gray-100'>
                                                <CardContent className='p-4'>
                                                    <div className='flex items-center gap-4'>
                                                        <div className='p-2 bg-gray-50 rounded-md'>
                                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className='text-sm text-gray-500'>Size</p>
                                                            <p className='text-lg font-medium text-gray-900'>{product.size}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className='text-gray-600 leading-relaxed'>
                                        <p>{product.description || "N/A"}</p>
                                    </div>

                                    <div className='flex items-center border border-gray-200 rounded-md overflow-hidden bg-white'>
                                        <button
                                            className='px-4 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                            onClick={() => handleQuantityChange('decrease')}
                                            disabled={quantity <= 1}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                            </svg>
                                        </button>

                                        <span className='px-4 py-2 border-x border-gray-200 font-medium'>{quantity}</span>
                                        <button
                                            className='px-4 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                            onClick={() => handleQuantityChange('increase')}
                                            disabled={quantity >= (product.stock || 0)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Add to Cart */}
                                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full'>
                                        <div className='w-full sm:w-1/2'>
                                            <Button
                                                className='w-full bg-gray-900 hover:bg-gray-800 text-white py-6 px-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md'
                                                onClick={() => handleAddToCart({
                                                    id: product.id,
                                                    title: product.title,
                                                    price: product.price,
                                                    thumbnail: product.thumbnail
                                                })}
                                                disabled={loadingProductId === product.id || !product.stock || product.stock <= 0}
                                            >
                                                {loadingProductId === product.id ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        <span className="font-medium">Adding...</span>
                                                    </>
                                                ) : !product.stock || product.stock <= 0 ? (
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
                                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                            />
                                                        </svg>
                                                        <span className="font-medium">Stok Habis</span>
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
                                                        <span className="font-medium">Add to Cart</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <div className='w-full sm:w-1/2'>
                                            <Link href={product.shopeUrl} className='w-full'>
                                                <button className='cursor-pointer w-full p-3 bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md'>
                                                    <Image
                                                        src={ShopeFod}
                                                        alt="Shopee"
                                                        width={20}
                                                        height={20}
                                                        className="object-contain"
                                                    />
                                                    <span className='text-sm font-medium'>Beli Sekarang</span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Detail Section */}
                    <div className='mt-12 pt-8 border-t border-gray-100'>
                        <h3 className='text-xl font-medium text-gray-900 mb-6 flex items-center gap-2'>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            Product Details
                        </h3>
                        <Card className='border border-gray-100'>
                            <CardContent className='prose prose-lg max-w-none text-gray-600 p-6 border-t border-gray-100' dangerouslySetInnerHTML={{ __html: product.content }} />
                        </Card>
                    </div>

                    {/* Related Products Section */}
                    <div className='mt-12'>
                        <h3 className='text-xl font-medium text-gray-900 mb-6 flex items-center gap-2'>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Related Products
                        </h3>
                        <div className='lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 snap-x snap-mandatory lg:mx-0 lg:px-0 lg:pb-0 ml-0'>
                            {(() => {
                                const filteredProducts = allProducts
                                    .filter(p => p.id !== product.id)
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                                const food = filteredProducts
                                    .filter(p => p.category.toLowerCase() === 'makanan')
                                    .slice(0, 2);

                                const beverage = filteredProducts
                                    .filter(p => p.category.toLowerCase() === 'minuman')
                                    .slice(0, 2);

                                return [...food, ...beverage].map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/products/${relatedProduct.slug}`}
                                        onClick={(e) => handleProductClick(e, relatedProduct.slug, relatedProduct.title)}
                                        className='group lg:w-auto w-[280px] flex-none lg:flex-1 snap-start'
                                    >
                                        <Card className='overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg h-full'>
                                            <div className='aspect-[4/3] relative overflow-hidden bg-gray-50'>
                                                <div
                                                    className='w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110'
                                                    style={{ backgroundImage: `url(${relatedProduct.thumbnail})` }}
                                                />
                                                <div className='absolute bottom-3 left-3 flex gap-2'>
                                                    <span className='px-2 py-1 bg-gray-900/90 text-white text-xs font-medium rounded-md backdrop-blur-sm'>
                                                        {relatedProduct.category}
                                                    </span>
                                                    {relatedProduct.size && relatedProduct.size !== "null" && (
                                                        <span className='px-2 py-1 bg-gray-900/90 text-white text-xs font-medium rounded-md backdrop-blur-sm'>
                                                            {relatedProduct.size}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <CardContent className='p-4 space-y-3 transition-colors duration-300 group-hover:bg-gray-50'>
                                                <h4 className='text-base font-medium text-gray-900 line-clamp-1 group-hover:text-gray-700'>{relatedProduct.title}</h4>

                                                <div className='flex items-center text-sm text-gray-500'>
                                                    <span>Stock: {relatedProduct.stock || 0}</span>
                                                    <span className='mx-2'>•</span>
                                                    <span>Sold: {relatedProduct.sold || 0}</span>
                                                </div>

                                                <p className='text-lg font-medium text-gray-900 group-hover:text-gray-700'>Rp. {relatedProduct.price}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            </section>

            <LoadingOverlay
                isLoading={!!loadingId || loadingProgress > 0}
                message={`Loading ${relatedProducts.find((p: ProductsData) => p.slug === loadingId)?.title || 'product'} details...`}
                progress={loadingProgress}
            />
        </Fragment>
    )
}
