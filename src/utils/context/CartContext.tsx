import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { database } from '@/utils/firebase/Firebase';
import { ref, set, get, remove, onValue } from 'firebase/database';
import { useAuth } from '@/utils/context/AuthContext';

export interface CartItem {
    id: string;
    title: string;
    price: string;
    thumbnail: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    loadingProductId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
    const { user } = useAuth();

    // Load cart from Firebase when user changes
    useEffect(() => {
        if (!user) {
            setItems([]);
            return;
        }

        const cartRef = ref(database, `carts/${user.uid}`);

        // Listen for real-time updates
        const unsubscribe = onValue(cartRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert object to array
                const cartItems = Object.values(data) as CartItem[];
                setItems(cartItems);
            } else {
                setItems([]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
        if (!user) return;

        setLoadingProductId(product.id);
        try {
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay

            const cartRef = ref(database, `carts/${user.uid}`);
            const snapshot = await get(cartRef);
            const currentCart = snapshot.val() || {};

            // Check if product already exists
            const existingItem = Object.values(currentCart).find(
                (item: any) => item.id === product.id
            );

            if (existingItem) {
                // Update quantity if item exists
                const updatedCart = Object.entries(currentCart).reduce((acc, [key, value]: [string, any]) => {
                    if (value.id === product.id) {
                        acc[key] = { ...value, quantity: value.quantity + 1 };
                    } else {
                        acc[key] = value;
                    }
                    return acc;
                }, {} as Record<string, CartItem>);

                await set(cartRef, updatedCart);
            } else {
                // Add new item
                const newItem = { ...product, quantity: 1 };
                const newKey = `item_${Date.now()}`;
                await set(ref(database, `carts/${user.uid}/${newKey}`), newItem);
            }

            toast.success('Added to cart');
        } finally {
            setLoadingProductId(null);
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!user) return;

        const cartRef = ref(database, `carts/${user.uid}`);
        const snapshot = await get(cartRef);
        const currentCart = snapshot.val() || {};

        // Find the key of the item to remove
        const itemKey = Object.entries(currentCart).find(
            ([_, value]: [string, any]) => value.id === productId
        )?.[0];

        if (itemKey) {
            await remove(ref(database, `carts/${user.uid}/${itemKey}`));
            toast.success('Item removed from cart');
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!user) return;

        if (quantity < 1) {
            await removeFromCart(productId);
            return;
        }

        const cartRef = ref(database, `carts/${user.uid}`);
        const snapshot = await get(cartRef);
        const currentCart = snapshot.val() || {};

        // Find and update the item
        const updatedCart = Object.entries(currentCart).reduce((acc, [key, value]: [string, any]) => {
            if (value.id === productId) {
                acc[key] = { ...value, quantity };
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, CartItem>);

        await set(cartRef, updatedCart);
    };

    const clearCart = async () => {
        if (!user) return;

        const cartRef = ref(database, `carts/${user.uid}`);
        await remove(cartRef);
        toast.success('Cart cleared');
    };

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            loadingProductId
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
} 