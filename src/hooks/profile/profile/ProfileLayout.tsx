"use client"

import React, { useState, useRef } from 'react'

import { useAuth } from "@/utils/context/AuthContext"

import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { User, Mail, Phone, Camera } from "lucide-react"

import { toast } from "sonner"

import imagekitInstance from '@/utils/imagekit/imagekit'

import { doc, updateDoc } from 'firebase/firestore'

import { db } from '@/utils/firebase/Firebase'

export default function ProfileLayout() {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageUpload = async (file: File) => {
        if (!user?.uid) {
            toast.error("User not authenticated")
            return
        }

        try {
            setIsUploading(true)

            // Convert to base64
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onload = async () => {
                const base64Image = reader.result as string

                // Upload to ImageKit
                const uploadResponse = await imagekitInstance.upload({
                    file: base64Image,
                    fileName: `profile-${user.uid}-${Date.now()}`,
                    folder: '/profile-images'
                })

                if (uploadResponse.url) {
                    // Update user profile in Firestore
                    const userRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid)
                    await updateDoc(userRef, {
                        photoURL: uploadResponse.url,
                        updatedAt: new Date()
                    })

                    // Update local state
                    if (user) {
                        user.photoURL = uploadResponse.url
                    }

                    toast.success("Profile picture updated successfully")
                } else {
                    throw new Error('No URL returned from upload')
                }
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error(error instanceof Error ? error.message : "Failed to upload profile picture")
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file")
                return
            }
            handleImageUpload(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.uid) {
            toast.error("User not authenticated")
            return
        }

        try {
            const userRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid)
            await updateDoc(userRef, {
                displayName: formData.displayName,
                phoneNumber: formData.phoneNumber,
                updatedAt: new Date()
            })

            // Update local state
            if (user) {
                user.displayName = formData.displayName
                user.phoneNumber = formData.phoneNumber
            }

            toast.success("Profile updated successfully")
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error("Failed to update profile")
        }
    }

    if (!user) return null

    return (
        <div className="w-full h-full p-4 sm:p-6 bg-white">
            <Card>
                <CardContent className="pt-6">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="relative">
                            <Avatar className="w-32 h-32 mb-4 ring-4 ring-primary/10">
                                {user.photoURL ? (
                                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                                ) : (
                                    <AvatarFallback className="text-4xl">
                                        {user.displayName?.charAt(0) || "U"}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.displayName}</h2>
                        <p className="text-base text-gray-600">{user.email}</p>
                    </div>

                    {!isEditing ? (
                        <>
                            {/* Profile Information Display */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Display Name</p>
                                        <p className="text-base font-medium">{user.displayName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email Address</p>
                                        <p className="text-base font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone Number</p>
                                        <p className="text-base font-medium">{user.phoneNumber || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Profile Button */}
                            <div className="border-t pt-6">
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Edit Profile Form */
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Edit Profile</h3>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your display name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
