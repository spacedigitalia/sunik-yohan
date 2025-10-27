export interface TransactionData {
    transactionId: string;
    orderDate: string;
    status: 'success' | 'failed';
    expirationTime: string;
    totalAmount: number;
    shippingCost: number;
    message?: string;
    userInfo: {
        displayName: string;
        email: string;
        photoURL?: string;
    };
    shippingInfo: {
        firstName: string;
        email: string;
        phone: string;
        addressType: string;
        rt: string;
        rw: string;
        streetName: string;
        landmark: string;
        district?: string;
        city: string;
        province: string;
        postalCode: string;
    };
    items: Array<{
        id: string;
        title: string;
        price: string;
        quantity: number;
        thumbnail: string;
    }>;
    paymentInfo: {
        method: string;
        status: 'pending' | 'accepted' | 'rejected';
        proof?: string;
    };
    deliveryStatus?: {
        status: string;
        history: Array<{
            status: string;
            timestamp: string;
            description: string;
        }>;
        estimatedDelivery?: string;
    };
}

export type ExtendedTransactionData = TransactionData & {
    docId: string;
};

// Order modal for transaction
export interface OrderModalProps {
    transaction: {
        items: Array<{
            thumbnail: string;
            title: string;
            quantity: number;
            price: number;
        }>;
        totalAmount: number;
        shippingCost: number;
    };
}

export interface ShippingInfo {
    firstName: string;
    email: string;
    phone: string;
    streetName: string;
    city: string;
    province: string;
    postalCode: string;
    rt: string;
    rw: string;
    landmark?: string;
    addressType: string;
    district?: string;
}

export interface ShippingInfoProps {
    shippingInfo: ShippingInfo;
}

// Order modal for transaction pending
export interface DeliveryModalProps {
    transaction: {
        deliveryStatus: {
            status: string;
            estimatedDelivery: string;
            history: Array<{
                status: string;
                timestamp: string;
                description: string;
            }>;
        };
    };
}

export interface ShipingModalProps {
    shippingInfo: ShippingInfo;
}

export interface ShipedModalProps {
    transaction: {
        shippingInfo: ShippingInfo;
        deliveryStatus?: {
            status: string;
            estimatedDelivery: string;
            history: Array<{
                status: string;
                timestamp: string;
                description: string;
            }>;
        };
    };
}

