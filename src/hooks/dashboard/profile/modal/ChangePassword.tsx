import React, { useState } from 'react'

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Key, Eye, EyeOff } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { toast } from "sonner"

import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'

import { auth } from '@/utils/firebase/Firebase'

interface ChangePasswordProps {
    isChangingPassword: boolean
    setIsChangingPassword: (value: boolean) => void
}

export default function ChangePassword({
    isChangingPassword,
    setIsChangingPassword
}: ChangePasswordProps) {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)

    const handlePasswordChange = async () => {
        if (!auth.currentUser) return

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        try {
            setIsPasswordLoading(true)
            // Re-authenticate user before changing password
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email!,
                passwordData.currentPassword
            )

            await reauthenticateWithCredential(auth.currentUser, credential)

            // Now change the password
            await updatePassword(auth.currentUser, passwordData.newPassword)

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setIsChangingPassword(false)
            toast.success('Password updated successfully. You will be logged out in 3 seconds.')

            // Logout after 3 seconds using API route
            setTimeout(async () => {
                try {
                    const response = await fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })

                    if (!response.ok) {
                        throw new Error('Logout failed')
                    }

                    window.location.href = '/auth/login'
                } catch (error) {
                    console.error('Error during logout:', error)
                    toast.error('Failed to logout automatically. Please logout manually.')
                }
            }, 3000)
        } catch (error: any) {
            console.error('Error updating password:', error)
            if (error.code === 'auth/wrong-password') {
                toast.error('Current password is incorrect')
            } else if (error.code === 'auth/requires-recent-login') {
                toast.error('Please sign out and sign in again before changing your password')
            } else {
                toast.error('Failed to update password')
            }
        } finally {
            setIsPasswordLoading(false)
        }
    }

    return (
        <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and your new password.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordChange}
                        disabled={isPasswordLoading}
                    >
                        {isPasswordLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                Updating...
                            </div>
                        ) : (
                            'Update Password'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 