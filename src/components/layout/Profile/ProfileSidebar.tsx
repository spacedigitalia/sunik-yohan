"use client";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
    User,
    LogOut,
    ChevronRight,
    Shield,
    ChevronDown,
    CreditCard,
    UserPen,
    MapPin
} from "lucide-react";

import { useState } from "react";

import { cn } from "@/lib/utils";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

interface ProfileSidebarProps {
    onLinkClick?: () => void;
}

interface SubItem {
    title: string;
    href: string;
}

interface NavItem {
    title: string;
    href: string;
    icon: any;
    subItems?: SubItem[];
}

const sidebarNavItems: NavItem[] = [
    {
        title: "Overview",
        href: "/profile",
        icon: User,
    },

    {
        title: "Transaksi",
        href: "/profile/transaction",
        icon: CreditCard,
        subItems: [
            { title: "Tranksaksi", href: "/profile/transaction/transaction" },
            { title: "Tertunda", href: "/profile/transaction/pending" },
            { title: "Dikirim", href: "/profile/transaction/delivery" },
            { title: "Selesai", href: "/profile/transaction/completed" },
        ],
    },

    {
        title: "Alamat",
        href: "/profile/address",
        icon: MapPin,
    },

    {
        title: "Security",
        href: "/profile/security",
        icon: Shield,
        subItems: [
            { title: "Password", href: "/profile/security/password" },
            { title: "Delete Accounts", href: "/profile/security/delete" },
        ],
    },

    {
        title: "Profile",
        href: "/profile/profile",
        icon: UserPen,
    },
];

export default function ProfileSidebar({ onLinkClick }: ProfileSidebarProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    if (!user) return null;

    const toggleItem = (href: string) => {
        setExpandedItems(prev =>
            prev.includes(href)
                ? prev.filter(item => item !== href)
                : [...prev, href]
        );
    };

    const isItemExpanded = (href: string) => expandedItems.includes(href);
    const isActive = (href: string) => pathname === href;
    const isSubItemActive = (subItems?: SubItem[]) =>
        subItems?.some(subItem => pathname === subItem.href) || false;

    return (
        <div className="w-70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r flex flex-col h-full">
            <div className="p-6 border-b">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                            {user.photoURL ? (
                                <AvatarImage src={user.photoURL} alt={user.displayName || "Profile"} className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-base font-medium bg-primary/5 text-primary">
                                    {user.displayName?.charAt(0) || "U"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-foreground truncate">{user.displayName}</h2>
                        <p className="text-xs text-muted-foreground/80 truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4">
                    <nav className="space-y-2">
                        {sidebarNavItems.map((item) => {
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isExpanded = isItemExpanded(item.href);
                            const isItemActive = isActive(item.href) || isSubItemActive(item.subItems);

                            return (
                                <div key={item.href} className="space-y-1">
                                    {hasSubItems ? (
                                        <Collapsible
                                            open={isExpanded}
                                            onOpenChange={() => toggleItem(item.href)}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start items-center h-11 px-3 rounded-xl",
                                                        isItemActive && "bg-primary/5 text-primary font-medium",
                                                        "hover:bg-primary/5 transition-colors"
                                                    )}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center mr-3">
                                                        <item.icon className={cn(
                                                            "w-4 h-4",
                                                            isItemActive ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                    </div>
                                                    <span className="text-sm">{item.title}</span>
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-4 h-4 ml-auto transition-transform duration-200",
                                                            isExpanded && "transform rotate-180"
                                                        )}
                                                    />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pl-4 space-y-1 mt-1">
                                                {item.subItems?.map((subItem) => (
                                                    <Link key={subItem.href} href={subItem.href} onClick={onLinkClick}>
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                "w-full justify-start items-center h-9 px-3 text-sm rounded-lg",
                                                                isActive(subItem.href) && "bg-primary/5 text-primary font-medium",
                                                                "hover:bg-primary/5 transition-colors"
                                                            )}
                                                        >
                                                            {subItem.title}
                                                            {isActive(subItem.href) && (
                                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                                            )}
                                                        </Button>
                                                    </Link>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <Link href={item.href} onClick={onLinkClick}>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start items-center h-11 px-3 rounded-xl",
                                                    isItemActive && "bg-primary/5 text-primary font-medium",
                                                    "hover:bg-primary/5 transition-colors"
                                                )}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center mr-3">
                                                    <item.icon className={cn(
                                                        "w-4 h-4",
                                                        isItemActive ? "text-primary" : "text-muted-foreground"
                                                    )} />
                                                </div>
                                                <span className="text-sm">{item.title}</span>
                                                {isItemActive && (
                                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                                )}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start items-center h-11 px-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/5 transition-colors"
                    onClick={logout}
                >
                    <div className="w-8 h-8 rounded-lg bg-destructive/5 flex items-center justify-center mr-3">
                        <LogOut className="w-4 h-4 text-destructive" />
                    </div>
                    <span className="text-sm font-medium">Logout</span>
                </Button>
            </div>
        </div>
    );
} 