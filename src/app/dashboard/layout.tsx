"use client";

import { useAuth } from "@/utils/context/AuthContext";

import { Role } from "@/types/Auth";

import { useEffect, useState } from "react";

import AdminHeader from "@/components/layout/Dashboard/Sidebar";

import Header from "@/components/layout/Dashboard/Header";

import AccessDenied from "@/hooks/dashboard/AccessDenied";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { hasRole, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (!user) {
            window.location.href = '/';
            return;
        }

        const currentPath = window.location.pathname;

        if (currentPath.startsWith('/dashboard')) {
            if (!hasRole(Role.ADMIN)) {
                setIsAuthorized(false);
                return;
            }
        } else {
            window.location.href = '/';
            return;
        }

        setIsAuthorized(true);
    }, [hasRole, user]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsSidebarOpen(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isAuthorized) {
        return <AccessDenied />;
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile Sidebar */}
            {isMobile && (
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-80">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <AdminHeader onSidebarToggle={setIsSidebarOpen} />
                    </SheetContent>
                </Sheet>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className="fixed top-0 left-0 z-30 w-80 h-screen bg-background border-r">
                    <AdminHeader onSidebarToggle={setIsSidebarOpen} />
                </aside>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-80">
                {/* Header */}
                <Header onMenuClick={toggleSidebar} />

                {/* Page content */}
                <main className="flex-1 px-4 py-4 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
} 