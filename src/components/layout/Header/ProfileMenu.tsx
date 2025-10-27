import Link from 'next/link'

import { UserCircle, ChevronDown } from 'lucide-react'

import { useAuth } from '@/utils/context/AuthContext'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

interface ProfileMenuProps {
    isProfileOpen: boolean
    toggleProfile: () => void
}

export default function ProfileMenu({ isProfileOpen, toggleProfile }: ProfileMenuProps) {
    const { user, logout, getDashboardUrl } = useAuth()

    if (!user) return null

    return (
        <DropdownMenu open={isProfileOpen} onOpenChange={toggleProfile}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3 md:px-4 py-2">
                    <Avatar className="w-8 h-8 md:w-10 md:h-10">
                        {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName || "Profile"} />
                        ) : (
                            <AvatarFallback>
                                <UserCircle className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate text-gray-700">
                        {user.displayName}
                    </span>
                    <ChevronDown className={`hidden md:inline transition-transform duration-200 text-gray-600 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href={getDashboardUrl(user.role)}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={toggleProfile}
                    >
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted">📊</span>
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={async () => {
                        await logout()
                        toggleProfile()
                    }}
                >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-muted">🚪</span>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 