import { useState, useEffect } from 'react'

import { useAuth } from '@/utils/context/AuthContext'

import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { db } from '@/utils/firebase/Firebase'

import { UserAccount } from '@/types/Auth'

import { updateProfile } from 'firebase/auth'

import { auth } from '@/utils/firebase/Firebase'

import imagekitInstance from '@/utils/imagekit/imagekit'

import { toast } from "sonner"

export default function useManagementProfile() {
    const { user } = useAuth()
    const [userData, setUserData] = useState<UserAccount | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [isChangingPhoto, setIsChangingPhoto] = useState(false)
    const [editedData, setEditedData] = useState<Partial<UserAccount>>({})
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.uid) {
                try {
                    const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid))
                    if (userDoc.exists()) {
                        setUserData(userDoc.data() as UserAccount)
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchUserData()
    }, [user])

    const handleSave = async () => {
        if (!user?.uid || !editedData) return

        try {
            const userRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid)
            await updateDoc(userRef, {
                ...editedData,
                updatedAt: new Date()
            })

            setUserData(prev => prev ? { ...prev, ...editedData } : null)
            setIsEditing(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
    }

    const handleSavePhoto = async () => {
        if (!selectedFile || !user?.uid) return

        try {
            setIsUploading(true)
            const reader = new FileReader()
            reader.readAsDataURL(selectedFile)
            reader.onloadend = async () => {
                const base64data = reader.result as string
                const base64String = base64data.split(',')[1]

                try {
                    const uploadResponse = await imagekitInstance.upload({
                        file: base64String,
                        fileName: `profile_${user.uid}_${Date.now()}.jpg`,
                        folder: '/profiles'
                    })

                    if (uploadResponse.url) {
                        // Update Firebase Auth profile
                        if (auth.currentUser) {
                            await updateProfile(auth.currentUser, {
                                photoURL: uploadResponse.url
                            })
                        }

                        // Update Firestore user data
                        const userRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid)
                        await updateDoc(userRef, {
                            photoURL: uploadResponse.url,
                            updatedAt: new Date()
                        })

                        // Update local state
                        setUserData(prev => prev ? { ...prev, photoURL: uploadResponse.url } : null)
                        setIsChangingPhoto(false)
                        setSelectedFile(null)
                        toast.success('Profile photo updated successfully')
                    }
                } catch (error) {
                    console.error('Error uploading to ImageKit:', error)
                    toast.error('Failed to upload profile photo')
                } finally {
                    setIsUploading(false)
                }
            }
        } catch (error) {
            console.error('Error processing image:', error)
            toast.error('Failed to process image')
            setIsUploading(false)
        }
    }

    return {
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
    }
}
