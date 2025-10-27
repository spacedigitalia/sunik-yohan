import React from 'react';

import { usePathname } from 'next/navigation';

import Link from 'next/link';

import Image from 'next/image';

import { menuItems } from '@/components/layout/Dashboard/data/Sidebar';

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useAuth } from '@/utils/context/AuthContext';

interface HeaderProps {
    onSidebarToggle: (isOpen: boolean) => void;
}

interface MenuItem {
    href: string;
    label: string;
    subItems?: SubMenuItem[];
}

interface SubMenuItem {
    href: string;
    label: string;
}

export default function SuperAdminHeader({ onSidebarToggle }: HeaderProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const [activeDropdown, setActiveDropdown] = React.useState<number | null>(null);
    const [temperature, setTemperature] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTemperature = async () => {
            try {
                if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) {
                    console.warn('Weather API key is not configured');
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=Jakarta`
                );

                if (!response.ok) {
                    throw new Error(`Weather API responded with status: ${response.status}`);
                }

                const data = await response.json();
                setTemperature(data.current.temp_c);
            } catch (error) {
                console.error('Error fetching temperature:', error);
                setTemperature(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTemperature();
    }, []);

    const handleLinkClick = () => {
        onSidebarToggle(false);
        setActiveDropdown(null);
    };

    const isLinkActive = (href: string) => {
        if (!pathname) return false;

        if (href === '/') {
            return pathname === '/';
        }
        if (href === '/dashboard') {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(href + '/');
    };

    const isDropdownActive = (item: MenuItem) => {
        if (item.subItems) {
            return item.subItems.some((subItem: SubMenuItem) => isLinkActive(subItem.href));
        }
        return false;
    };

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
            {/* Logo Section */}
            <div className="p-6 border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center overflow-hidden">
                        {user?.photoURL ? (
                            <Image
                                src={user.photoURL}
                                alt="User Profile"
                                width={32}
                                height={32}
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-lg font-bold text-sidebar-primary-foreground">
                                {user?.displayName?.[0] || 'S'}
                            </span>
                        )}
                    </div>
                    <span className="text-xl font-semibold bg-gradient-to-r from-sidebar-primary to-sidebar-primary/60 bg-clip-text text-transparent">
                        Sunik Yohan
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <ul className="space-y-1.5">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            {item.subItems ? (
                                <div className="relative">
                                    <Button
                                        onClick={() => toggleDropdown(index)}
                                        variant={isDropdownActive(item) ? "default" : "ghost"}
                                        className={cn(
                                            "w-full justify-between group h-11",
                                            isDropdownActive(item) && "bg-sidebar-primary text-sidebar-primary-foreground"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "p-1.5 rounded-lg transition-colors",
                                                isDropdownActive(item)
                                                    ? "bg-sidebar-primary-foreground/10"
                                                    : "group-hover:bg-sidebar-accent"
                                            )}>
                                                <item.icon className={cn(
                                                    "w-5 h-5",
                                                    isDropdownActive(item) ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground"
                                                )} />
                                            </div>
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        <svg
                                            className={cn(
                                                "w-4 h-4 transition-transform duration-200",
                                                activeDropdown === index && "rotate-180"
                                            )}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </Button>
                                    <div
                                        className={cn(
                                            "overflow-hidden transition-all duration-200",
                                            activeDropdown === index ? "max-h-96" : "max-h-0"
                                        )}
                                    >
                                        <div className="relative">
                                            {/* Vertical line */}
                                            <div className="absolute left-4 top-0 bottom-0 w-px bg-sidebar-border" />

                                            <ul className="mt-1 ml-4 space-y-1">
                                                {item.subItems.map((subItem, subIndex) => (
                                                    <li key={subIndex} className="relative">
                                                        {/* Horizontal line */}
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-sidebar-border" />

                                                        <Link
                                                            href={subItem.href}
                                                            onClick={handleLinkClick}
                                                            className={cn(
                                                                "block h-11 items-center p-3 text-sm rounded-md transition-colors relative",
                                                                isLinkActive(subItem.href)
                                                                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                                                                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                            )}
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-md transition-colors group h-11",
                                        isLinkActive(item.href)
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        isLinkActive(item.href)
                                            ? "bg-sidebar-primary-foreground/10"
                                            : "group-hover:bg-sidebar-accent"
                                    )}>
                                        <item.icon className={cn(
                                            "w-5 h-5",
                                            isLinkActive(item.href) ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground"
                                        )} />
                                    </div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Temperature Widget */}
            <div className="px-6 py-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-sidebar-accent/20 to-sidebar-accent/5 backdrop-blur-sm border border-sidebar-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-sidebar-accent-foreground">Living Room Temperature</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="relative w-8 h-8">
                                    <svg
                                        className="w-8 h-8 text-sidebar-accent"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                            fill="currentColor"
                                            className="animate-pulse"
                                        />
                                    </svg>
                                    {temperature && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xs font-medium text-sidebar-accent-foreground">
                                                {Math.round(temperature)}°
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-2xl font-semibold bg-gradient-to-r from-sidebar-accent to-sidebar-accent/60 bg-clip-text text-transparent">
                                    {loading ? 'Loading...' : temperature ? `${Math.round(temperature)}°C` : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-sidebar/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-sidebar-border">
                            <div className="w-8 h-8 rounded-full bg-sidebar-accent/20 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full bg-sidebar-accent animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}