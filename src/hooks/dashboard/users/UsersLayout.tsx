"use client"

import React, { useEffect, useState } from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { LayoutDashboard, Users, Info } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { collection, getDocs, query, where } from 'firebase/firestore'

import { db } from '@/utils/firebase/Firebase'

import { Role, UserAccount } from '@/types/Auth'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { format, isValid } from "date-fns"

import { Button } from "@/components/ui/button"

import { Eye, Trash2, Loader2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"

import { useAuth } from "@/utils/context/AuthContext"

import { auth } from "@/utils/firebase/Firebase"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Address {
    addressType: string
    city: string
    createdAt: string
    fullName: string
    isPrimary: boolean
    landmark: string
    location: {
        address: string
        city: string
        lat: number
        lng: number
        postalCode: string
        province: string
    }
    phone: string
    postalCode: string
    province: string
    rt: string
    rw: string
    streetName: string
}

import UsersSkeleton from "@/hooks/dashboard/users/UsersSkelaton"

export default function UsersLayout() {
    const [users, setUsers] = useState<UserAccount[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const { user: currentUser } = useAuth()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const q = query(
                    collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string),
                    where("role", "==", Role.USER)
                )
                const querySnapshot = await getDocs(q)
                const userData = querySnapshot.docs.map(doc => {
                    const data = doc.data()
                    // Convert Firestore Timestamp to Date if needed
                    const createdAt = data.createdAt instanceof Date
                        ? data.createdAt
                        : data.createdAt?.toDate?.() || new Date()

                    return {
                        ...data,
                        uid: doc.id,
                        createdAt
                    }
                }) as UserAccount[]
                setUsers(userData)
            } catch (error) {
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const formatDate = (date: Date | string | number) => {
        try {
            const dateObj = new Date(date)
            if (!isValid(dateObj)) {
                return '-'
            }
            return format(dateObj, 'dd MMM yyyy')
        } catch (error) {
            return '-'
        }
    }

    const handleStatusChange = async (userId: string, newStatus: boolean) => {
        if (!currentUser) {
            toast.error("You must be logged in to perform this action")
            return
        }

        try {
            setUpdating(userId)

            // Get the current user's ID token
            const idToken = await auth.currentUser?.getIdToken()
            if (!idToken) {
                throw new Error("Failed to get authentication token")
            }

            const response = await fetch(`/api/admins/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    isActive: newStatus
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to update user status')
            }

            // Update local state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.uid === userId
                        ? { ...user, isActive: newStatus }
                        : user
                )
            )

            toast.success(`User status updated successfully`)
        } catch (error) {
            console.error("Error updating user status:", error)
            toast.error(error instanceof Error ? error.message : "Failed to update user status")
        } finally {
            setUpdating(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!currentUser) {
            toast.error("You must be logged in to perform this action")
            return
        }

        try {
            setDeleting(userId)

            // Get the current user's ID token
            const idToken = await auth.currentUser?.getIdToken()
            if (!idToken) {
                throw new Error("Failed to get authentication token")
            }

            const response = await fetch(`/api/admins/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete user')
            }

            // Update local state
            setUsers(prevUsers => prevUsers.filter(user => user.uid !== userId))
            toast.success("User deleted successfully")
        } catch (error) {
            console.error("Error deleting user:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete user")
        } finally {
            setDeleting(null)
        }
    }

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary sm:w-8 sm:h-8"
                        >
                            <path
                                d="M21 7L12 16L3 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M3 17L12 8L21 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 capitalize">
                                    <LayoutDashboard className="h-4 w-4" />
                                    dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/users" className="flex items-center gap-1 capitalize">
                                    <Users className="h-4 w-4" />
                                    Users
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Info className="h-4 w-4" />
                                    Users List
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <UsersSkeleton />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.uid}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                                                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{user.displayName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phoneNumber || '-'}</TableCell>
                                            <TableCell>
                                                <Select
                                                    defaultValue={user.isActive ? "true" : "false"}
                                                    onValueChange={(value) => handleStatusChange(user.uid, value === "true")}
                                                    disabled={updating === user.uid}
                                                >
                                                    <SelectTrigger className="w-[110px]">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">
                                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                                                Active
                                                            </span>
                                                        </SelectItem>
                                                        <SelectItem value="false">
                                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                                                                Inactive
                                                            </span>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(user.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>Address Information</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="mt-4 space-y-4">
                                                                {user.addresses && user.addresses.length > 0 ? (
                                                                    user.addresses.map((address: Address, index: number) => (
                                                                        <div key={index} className="border rounded-lg p-4 space-y-3">
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <h3 className="font-semibold">{address.fullName}</h3>
                                                                                    <p className="text-sm text-muted-foreground">{address.addressType}</p>
                                                                                </div>
                                                                                {address.isPrimary && (
                                                                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                                                                        Primary
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <p className="text-sm">
                                                                                    <span className="font-medium">Address:</span> {address.streetName}
                                                                                </p>
                                                                                <p className="text-sm">
                                                                                    <span className="font-medium">RT/RW:</span> {address.rt}/{address.rw}
                                                                                </p>
                                                                                <p className="text-sm">
                                                                                    <span className="font-medium">City:</span> {address.city}
                                                                                </p>
                                                                                <p className="text-sm">
                                                                                    <span className="font-medium">Province:</span> {address.province}
                                                                                </p>
                                                                                <p className="text-sm">
                                                                                    <span className="font-medium">Postal Code:</span> {address.postalCode}
                                                                                </p>
                                                                                <p className="text-sm">
                                                                                    <span className="font-medium">Phone:</span> {address.phone}
                                                                                </p>
                                                                                {address.landmark && (
                                                                                    <p className="text-sm">
                                                                                        <span className="font-medium">Landmark:</span> {address.landmark}
                                                                                    </p>
                                                                                )}
                                                                                <p className="text-sm">
                                                                                    <span className="font-medium">Coordinates:</span> {address.location.lat}, {address.location.lng}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-center text-muted-foreground">No addresses found</p>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                disabled={deleting === user.uid}
                                                            >
                                                                {deleting === user.uid ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                )}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the user account
                                                                    and remove their data from our servers.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel disabled={deleting === user.uid}>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(user.uid)}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                    disabled={deleting === user.uid}
                                                                >
                                                                    {deleting === user.uid ? (
                                                                        <div className="flex items-center gap-2">
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                            Deleting...
                                                                        </div>
                                                                    ) : (
                                                                        "Delete"
                                                                    )}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
