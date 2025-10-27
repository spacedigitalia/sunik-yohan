"use client"

import Image from "next/image";

import Link from "next/link";

import { Menu, MapPin, ShoppingCart, LogIn, Home, Info, Utensils, Newspaper, Image as ImageIcon } from "lucide-react";

import { menuHamburger } from "@/components/layout/Header/data/Header"

import React, { useEffect, useState } from "react";

import { useAuth } from "@/utils/context/AuthContext";

import ProfileMenu from "@/components/layout/Header/ProfileMenu";

import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Logo from "@/base/assets/logo.png"

import { useCart } from '@/utils/context/CartContext';

import { Minus, Plus, Trash2 } from 'lucide-react';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { totalItems, items, removeFromCart, updateQuantity } = useCart();
    const pathname = usePathname();
    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 180);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleCheckout = () => {
        if (!user) {
            router.push('/signin');
            setCartOpen(false);
            return;
        }
        router.push('/checkout');
        setCartOpen(false);
    };

    return (
        <>
            {/* Blur Overlay */}
            {cartOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[998] transition-opacity duration-300"
                    onClick={() => setCartOpen(false)}
                />
            )}
            <header className={`fixed ${scrolled ? 'top-2' : 'top-2'} left-0 right-0 z-50 flex justify-center items-start h-24 px-3 lg:px-12 transition-all duration-500`}>
                <div className={`w-full container rounded-[var(--radius)] ${scrolled ? 'bg-white/80 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-md'} px-6 py-3 flex items-center justify-between h-16 transition-all duration-500`}>
                    {/* Left Section - Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-all duration-300">
                            <Image
                                src={Logo}
                                alt="Logo"
                                width={110}
                                height={40}
                                className="h-16 w-auto rounded-full"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center Section - Navigation */}
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList className="gap-8">
                            {menuHamburger.map((item) => (
                                (item.name === "Login" && user) ? null : (
                                    <NavigationMenuItem key={item.href}>
                                        <Link href={item.href}>
                                            <Button
                                                variant="ghost"
                                                className={`text-gray-600 hover:text-gray-900 font-medium text-sm transition-all duration-300 hover:scale-105 ${item.href === '/' ? (pathname === '/' ? 'text-gray-900 bg-gray-100' : '') : (pathname?.startsWith(item.href) ? 'text-gray-900 bg-gray-100' : '')
                                                    }`}
                                            >
                                                {item.name === "Home" && <Home className="h-5 w-5" />}
                                                {item.name === "About" && <Info className="h-5 w-5" />}
                                                {item.name === "Products" && <Utensils className="h-5 w-5" />}
                                                {item.name === "Gallery" && <ImageIcon className="h-5 w-5" />}
                                                {item.name === "Blog" && <Newspaper className="h-5 w-5" />}
                                                {item.name}
                                            </Button>
                                        </Link>
                                    </NavigationMenuItem>
                                )
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right Section - Cart, Login/Profile, and Hamburger */}
                    <div className="flex items-center gap-0 md:gap-4">
                        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`hover:bg-gray-100/80 gap-2 relative group transition-all duration-300`}
                                >
                                    <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">Cart</span>
                                    <span className="absolute -top-1 -right-1 bg-gray-200 text-gray-600 text-xs rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                                        {totalItems}
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:max-w-lg p-0 bg-white/80 backdrop-blur-xl border-l rounded-l-[var(--radius)] z-[999]">
                                <div className="flex flex-col h-full">
                                    <SheetHeader className="px-6 py-4 border-b">
                                        <SheetTitle className="text-gray-900 text-xl font-semibold">Shopping Cart</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex-1 px-6 py-4 overflow-y-auto">
                                        {items.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                                <ShoppingCart className="w-12 h-12 mb-4" />
                                                <p className="text-lg">Your cart is empty</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                                        <div className="relative w-20 h-20 flex-shrink-0">
                                                            <Image
                                                                src={item.thumbnail}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover rounded-md"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                                                            <p className="text-sm text-[#FF204E] font-semibold mt-1">{item.price}</p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="w-8 text-center">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {items.length > 0 && (
                                        <div className="px-6 py-4 border-t">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-600">Total Items:</span>
                                                <span className="font-semibold">{totalItems}</span>
                                            </div>
                                            <Button
                                                className="w-full bg-[#FF204E] text-white hover:bg-[#e61e4d]"
                                                onClick={handleCheckout}
                                            >
                                                {user ? 'Checkout' : 'Sign in to Checkout'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                        {user ? (
                            <ProfileMenu
                                isProfileOpen={isProfileOpen}
                                toggleProfile={toggleProfile}
                            />
                        ) : (
                            <Button
                                variant="default"
                                className={`bg-gray-900 cursor-pointer hover:bg-gray-800 text-white transition-all duration-300 hover:scale-105 hidden sm:flex ${pathname === '/signin' ? 'bg-gray-800' : ''
                                    }`}
                                onClick={() => window.location.href = '/signin'}
                            >
                                Login
                            </Button>
                        )}
                        {!user && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`sm:hidden hover:bg-gray-100/80 transition-all duration-300 ${pathname === '/signin' ? 'bg-gray-100' : ''
                                    }`}
                                onClick={() => window.location.href = '/signin'}
                            >
                                <LogIn className="h-5 w-5 text-gray-600" />
                            </Button>
                        )}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100/80 transition-all duration-300">
                                    <Menu className="h-5 w-5 text-gray-600" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[70dvh] p-0 bg-white/80 backdrop-blur-xl border-t rounded-t-[var(--radius)]">
                                <div className="flex flex-col h-full">
                                    <SheetHeader className="px-6 py-4 border-b">
                                        <SheetTitle className="text-gray-900 text-xl font-semibold">Menu</SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex-1 px-6 py-4 overflow-y-auto">
                                        <ul className="flex flex-col gap-4">
                                            {menuHamburger.map((item) => (
                                                (item.name === "Login" && user) ? null : (
                                                    <li key={item.href}>
                                                        <Link href={item.href} onClick={handleLinkClick}>
                                                            <Button
                                                                variant="ghost"
                                                                className={`text-gray-600 hover:text-gray-900 text-base font-medium transition-all duration-300 w-full justify-start hover:bg-gray-100/80 rounded-[var(--radius)] py-6 gap-3 ${item.href === '/' ? (pathname === '/' ? 'text-gray-900 bg-gray-100' : '') : (pathname?.startsWith(item.href) ? 'text-gray-900 bg-gray-100' : '')
                                                                    }`}
                                                            >
                                                                {item.name === "Home" && <Home className="h-5 w-5" />}
                                                                {item.name === "About" && <Info className="h-5 w-5" />}
                                                                {item.name === "Products" && <Utensils className="h-5 w-5" />}
                                                                {item.name === "Gallery" && <ImageIcon className="h-5 w-5" />}
                                                                {item.name === "Blog" && <Newspaper className="h-5 w-5" />}
                                                                {item.name}
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </nav>
                                    <div className="px-6 py-4 border-t">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[var(--radius)]">
                                            <MapPin className="text-gray-400 text-xl" />
                                            <div>
                                                <h4 className="text-gray-900 font-medium text-sm">Visit Us</h4>
                                                <p className="text-gray-500 text-xs mt-1">123 Business Avenue, Suite 500<br />New York, NY 10001</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}