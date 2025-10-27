"use client"

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { auth } from '@/utils/firebase/Firebase'

import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, GoogleAuthProvider, signOut } from 'firebase/auth'

import { Input } from '@/components/ui/input'

import { Eye, EyeOff } from 'lucide-react'

export default function PasswordLayout() {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [isGoogleUser, setIsGoogleUser] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        const user = auth.currentUser
        if (user) {
            // Check if user is signed in with Google
            const isGoogle = user.providerData.some(
                (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
            )
            setIsGoogleUser(isGoogle)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (isGoogleUser) {
            setError('Akun Google tidak dapat mengubah password melalui halaman ini. Silakan gunakan pengaturan akun Google Anda.')
            setLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Password baru dan konfirmasi password tidak cocok')
            setLoading(false)
            return
        }

        if (newPassword.length < 6) {
            setError('Password baru harus minimal 6 karakter')
            setLoading(false)
            return
        }

        try {
            const user = auth.currentUser
            if (!user || !user.email) {
                throw new Error('User tidak ditemukan')
            }

            // Re-authenticate user
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            )
            await reauthenticateWithCredential(user, credential)

            // Update password
            await updatePassword(user, newPassword)
            setSuccess('Password berhasil diubah')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')

            // Sign out user after successful password change
            await signOut(auth)
            router.push('/login')
        } catch (err: any) {
            if (err.code === 'auth/wrong-password') {
                setError('Password saat ini tidak valid')
            } else {
                setError(err.message || 'Terjadi kesalahan saat mengubah password')
            }
        } finally {
            setLoading(false)
        }
    }

    if (isGoogleUser) {
        return (
            <section className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Ubah Password</h2>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm w-full">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-yellow-700">
                                    Anda login menggunakan akun Google. Untuk mengubah password, silakan kunjungi{' '}
                                    <a
                                        href="https://myaccount.google.com/security"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium underline text-yellow-700 hover:text-yellow-600 transition-colors duration-200"
                                    >
                                        pengaturan keamanan Google
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="min-h-full flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Ubah Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Password Saat Ini
                        </label>
                        <div className="relative">
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Password Baru
                        </label>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Konfirmasi Password Baru
                        </label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg border border-green-200">{success}</div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </span>
                        ) : 'Ubah Password'}
                    </button>
                </form>
            </div>
        </section>
    )
}
