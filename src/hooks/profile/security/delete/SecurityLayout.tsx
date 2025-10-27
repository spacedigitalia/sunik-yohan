"use client"

import React, { useState } from 'react'

import { auth } from '@/utils/firebase/Firebase'

import { useRouter } from 'next/navigation'

import DeleteAccountModal from '@/hooks/profile/security/delete/content/DeleteAccountModal'

import { useAuth } from '@/utils/context/AuthContext'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Shield, Trash2 } from "lucide-react"

export default function PrivacyContent() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();
    const { logout } = useAuth();

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            const currentUser = auth.currentUser;

            if (currentUser) {
                const idToken = await currentUser.getIdToken();

                const response = await fetch(`/api/account/${currentUser.uid}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete account');
                }

                await logout();
                router.push('/');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Gagal menghapus akun. Silakan coba login ulang dan coba lagi.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <section className="min-h-full">
            {/* Header Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Security Settings
                    </CardTitle>
                    <CardDescription>Kelola keamanan akun Anda</CardDescription>
                </CardHeader>
            </Card>

            {/* Main Content */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid gap-6">
                        {/* Data Protection Card */}
                        <Card className="bg-gray-50 hover:bg-gray-100 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Shield className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Data Protection</h3>
                                        <p className="text-gray-600 text-sm">Data Anda dienkripsi dan dilindungi menggunakan standar industri.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delete Account Card */}
                        <Card className="bg-red-50 border-red-100">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-red-100 rounded-lg">
                                            <Trash2 className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Hapus Akun</h3>
                                            <p className="text-gray-600 text-sm">Tindakan ini akan menghapus akun Anda secara permanen</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowDeleteModal(true)}
                                        disabled={isDeleting}
                                        className="w-full sm:w-auto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>{isDeleting ? 'Menghapus...' : 'Hapus Akun'}</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isDeleting}
            />
        </section>
    )
}