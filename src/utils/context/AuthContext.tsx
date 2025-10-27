import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { Role, UserAccount, FirebaseUser, AuthContextType } from '@/types/Auth';

import { auth, db } from '@/utils/firebase/Firebase';

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';

import { doc, getDoc, setDoc } from 'firebase/firestore';

import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const router = useRouter();

    const getDashboardUrl = (userRole: string) => {
        switch (userRole) {
            case Role.ADMIN:
                return `/dashboard`;
            case Role.USER:
                return `/profile`;
            default:
                return '/';
        }
    };

    const handleRedirect = (userData: UserAccount) => {
        // Check if there's a saved redirect URL
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin'); // Clear the saved URL
            router.push(redirectUrl);
            return;
        }

        // For regular users - redirect to home
        if (userData.role === Role.USER) {
            router.push('/');
            return;
        }

        // For other roles, redirect to their dashboard
        const dashboardUrl = getDashboardUrl(userData.role);
        router.push(dashboardUrl);
    };

    const login = async (email: string, password: string): Promise<UserAccount> => {
        try {
            if (!email || !password) {
                throw new Error('Email dan password harus diisi');
            }

            const emailString = String(email).trim();
            const userCredential = await signInWithEmailAndPassword(auth, emailString, password);

            const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, userCredential.user.uid));
            const userData = userDoc.data() as UserAccount;

            if (!userData) {
                throw new Error('User account not found');
            }

            // Check if user account is inactive
            if (!userData.isActive) {
                setShowInactiveModal(true);
                await signOut(auth);
                return userData; // Return userData but don't proceed with login
            }

            // Get Firebase auth token and create session
            const idToken = await userCredential.user.getIdToken();
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            setUser(userData);
            const welcomeMessage = getWelcomeMessage(userData);
            toast.success(welcomeMessage);
            handleRedirect(userData);

            return userData;
        } catch (error) {
            if (error instanceof Error) {
                // Check if the error is due to disabled account
                if (error.message.includes('auth/user-disabled')) {
                    setShowInactiveModal(true);
                } else {
                    toast.error('Login gagal: ' + error.message);
                }
            } else {
                toast.error('Terjadi kesalahan saat login');
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Sign out from Firebase
            await signOut(auth);
            setUser(null);

            // Clear the session cookie through an API call
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Important: This ensures cookies are included
            });

            // Clear any stored redirect URLs
            localStorage.removeItem('redirectAfterLogin');

            // Force reload the page to clear any remaining state
            window.location.href = '/';

            toast.success('Anda berhasil logout');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Terjadi kesalahan saat logout');
        }
    };

    const deleteAccount = async () => {
        try {
            if (!user) {
                throw new Error('No user logged in');
            }

            const idToken = await auth.currentUser?.getIdToken();
            if (!idToken) {
                throw new Error('Failed to get authentication token');
            }

            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete account');
            }

            setUser(null);
            toast.success('Akun berhasil dihapus');
            router.push('/');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus akun');
            throw error;
        }
    };

    const hasRole = (roles: string | string[]): boolean => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    const getWelcomeMessage = (userData: UserAccount): string => {
        const { displayName } = userData;
        return `Selamat datang, ${displayName}!`;
    };

    const createSocialUser = async (firebaseUser: FirebaseUser): Promise<UserAccount> => {
        const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, firebaseUser.uid);
        const userData: UserAccount = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            phoneNumber: '',
            role: Role.USER,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
        };

        await setDoc(userDocRef, userData, { merge: true });
        return userData;
    };

    const loginWithGoogle = async (): Promise<UserAccount> => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, result.user.uid));
            let userData: UserAccount;

            if (!userDoc.exists()) {
                userData = await createSocialUser({
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                });
            } else {
                userData = userDoc.data() as UserAccount;
            }

            // Check if user account is inactive
            if (!userData.isActive) {
                setShowInactiveModal(true);
                await signOut(auth);
                return userData; // Return userData but don't proceed with login
            }

            // Get Firebase auth token and create session
            const idToken = await result.user.getIdToken();
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            setUser(userData);
            const welcomeMessage = getWelcomeMessage(userData);
            toast.success(welcomeMessage);
            handleRedirect(userData);

            return userData;
        } catch (error) {
            // Check if the error is due to disabled account
            if (error instanceof Error && error.message.includes('auth/user-disabled')) {
                setShowInactiveModal(true);
            } else {
                toast.error('Gagal login dengan Google');
            }
            throw error;
        }
    };

    const signUp = async (email: string, password: string, displayName: string, phone: string): Promise<void> => {
        try {
            if (!process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS) {
                throw new Error('Collection path is not configured');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const userData: UserAccount = {
                uid: userCredential.user.uid,
                email: email,
                displayName: displayName,
                phoneNumber: phone,
                role: Role.USER,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            };

            const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS, userCredential.user.uid);
            await setDoc(userDocRef, userData);

            // Sign out immediately after creating account
            await signOut(auth);

            toast.success('Registration successful! Please log in.');
            router.push('/signin');
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/email-already-in-use')) {
                    toast.error('Email already in use. Please use a different email.');
                } else {
                    toast.error('Registration failed: ' + error.message);
                }
            } else {
                toast.error('Registration failed');
            }
            throw error;
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent! Please check your inbox.');
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/user-not-found')) {
                    toast.error('No account found with this email address.');
                } else {
                    toast.error('Failed to send reset email: ' + error.message);
                }
            } else {
                toast.error('Failed to send reset email.');
            }
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser && process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS) {
                    const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, firebaseUser.uid));
                    const userData = userDoc.data() as UserAccount;
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        deleteAccount,
        hasRole,
        getDashboardUrl,
        signUp,
        forgotPassword,
        showInactiveModal,
        setShowInactiveModal
    };
    return (
        <AuthContext.Provider value={value as AuthContextType}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};