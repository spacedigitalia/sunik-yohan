"use client"

import React from 'react'

import { Role } from '@/types/Auth'

import { User, Mail, Phone, Calendar, Shield, CheckCircle2, XCircle, Camera } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import EditProfile from '@/hooks/dashboard/profile/modal/EditProfile'

import ChangePassword from '@/hooks/dashboard/profile/modal/ChangePassword'

import useManagementProfile from '@/hooks/dashboard/profile/lib/useManagementProfile'

import ProfileSkeleton from '@/hooks/dashboard/profile/ProfileSkelaton'

import { formatDate } from '@/base/helper/date'

export default function ProfileLayout() {
    const {
        userData,
        loading,
        isEditing,
        setIsEditing,
        isChangingPassword,
        setIsChangingPassword,
        isChangingPhoto,
        setIsChangingPhoto,
        editedData,
        setEditedData,
        selectedFile,
        setSelectedFile,
        isUploading,
        handleSave,
        handleImageUpload,
        handleSavePhoto
    } = useManagementProfile()

    if (loading) {
        return <ProfileSkeleton />
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
    }

    return (
        <section className="space-y-6">
            {userData && (
                <div className="grid gap-6">
                    {/* Cover Image and Profile Section */}
                    <div className="relative">
                        <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-primary/20 to-primary/40 rounded-t-lg"></div>
                        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
                                    {userData.photoURL ? (
                                        <AvatarImage src={userData.photoURL} alt={userData.displayName} />
                                    ) : (
                                        <AvatarFallback className="text-4xl">
                                            {getInitials(userData.displayName)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <Dialog open={isChangingPhoto} onOpenChange={setIsChangingPhoto}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Change Profile Photo</DialogTitle>
                                            <DialogDescription>
                                                Upload a new profile photo.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="photo">Choose Photo</Label>
                                                <Input
                                                    id="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                            {selectedFile && (
                                                <div className="flex justify-center">
                                                    <Avatar className="h-32 w-32">
                                                        <AvatarImage
                                                            src={URL.createObjectURL(selectedFile)}
                                                            alt="Preview"
                                                        />
                                                    </Avatar>
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => {
                                                setIsChangingPhoto(false)
                                                setSelectedFile(null)
                                            }}>
                                                Cancel
                                            </Button>
                                            {selectedFile && (
                                                <Button onClick={handleSavePhoto} disabled={isUploading}>
                                                    {isUploading ? 'Uploading...' : 'Save Photo'}
                                                </Button>
                                            )}
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <Card className="mt-14 sm:mt-16">
                        <CardHeader>
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl sm:text-2xl">{userData.displayName}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Mail className="h-4 w-4" />
                                            {userData.email}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <Badge variant={userData.isActive ? "default" : "destructive"} className="px-4 py-2">
                                            {userData.isActive ? (
                                                <span className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <XCircle className="h-4 w-4" />
                                                    Inactive
                                                </span>
                                            )}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <EditProfile
                                                isEditing={isEditing}
                                                setIsEditing={setIsEditing}
                                                userData={userData}
                                                editedData={editedData}
                                                setEditedData={setEditedData}
                                                handleSave={handleSave}
                                            />

                                            <ChangePassword
                                                isChangingPassword={isChangingPassword}
                                                setIsChangingPassword={setIsChangingPassword}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                            <p className="text-base">{userData.phoneNumber || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Role</p>
                                            <p className="text-base capitalize">{userData.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                                            <p className="text-base capitalize">{userData.role === Role.ADMIN ? 'Administrator' : 'Regular User'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                            <p className="text-base">{formatDate(userData.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </section>
    )
}

