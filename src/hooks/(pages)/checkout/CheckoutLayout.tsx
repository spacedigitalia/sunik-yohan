'use client';

import { useAuth } from "@/utils/context/AuthContext";

import { useCart } from "@/utils/context/CartContext";

import { Button } from "@/components/ui/button";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";

import { db } from "@/utils/firebase/Firebase";

import { createTransaction } from "@/utils/firebase/transaction";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import HeroCheckout from "@/hooks/(pages)/checkout/HeroCheckout"

import { Steps } from "@/components/ui/steps";

import PaymentOptions from "@/hooks/(pages)/checkout/PaymentOptions";

import type { TransactionData } from "@/utils/firebase/transaction";

// Form validation schema
const checkoutSchema = z.object({
    firstName: z.string().min(2, "Nama depan harus minimal 2 karakter"),
    email: z.string().email("Alamat email tidak valid"),
    streetName: z.string().min(5, "Nama jalan harus minimal 5 karakter"),
    landmark: z.string().min(3, "Patokan harus minimal 3 karakter"),
    province: z.string().min(1, "Provinsi harus diisi"),
    city: z.string().min(1, "Kota harus diisi"),
    postalCode: z.string().min(5, "Kode pos harus minimal 5 karakter"),
    phone: z.string().min(10, "Nomor telepon harus minimal 10 karakter"),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
    message: z.string().optional(),
    district: z.string().optional(),
    addressType: z.string().min(1, "Tipe alamat harus diisi"),
    rt: z.string().min(1, "RT harus diisi"),
    rw: z.string().min(1, "RW harus diisi")
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface SavedAddress {
    fullName: string;
    phone: string;
    streetName: string;
    landmark: string;
    province: string;
    city: string;
    postalCode: string;
    isPrimary?: boolean;
    district?: string;
    lat?: number;
    lng?: number;
    location?: {
        lat: number;
        lng: number;
    };
    addressType: string;
    rt: string;
    rw: string;
}

interface OngkirData {
    id: string;
    desa: string;
    price: string;
    createdAt: string;
    updatedAt: string;
}

const NoAddressFound = () => {
    const router = useRouter();

    return (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
                <svg
                    className="w-8 h-8 text-red-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-red-800 mb-1">Alamat Tidak Ditemukan</h2>
                    <p className="text-red-600 text-sm">Silakan tambahkan alamat Anda untuk melanjutkan pembayaran</p>
                </div>
                <button
                    onClick={() => router.push('/profile/address')}
                    className="px-4 py-2 bg-[#FF204E] text-white rounded-lg hover:bg-[#e61e4d] transition-colors duration-200 text-sm"
                >
                    Tambah Alamat
                </button>
            </div>
        </div>
    );
};

// Tambahkan type StepStatus
type StepStatus = "current" | "complete" | "upcoming";

type PaymentMethod = 'dana' | 'shopeepay' | 'seabank';

// Add CountdownTimer component
const CountdownTimer = ({ endTime }: { endTime: string }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endTime).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
                <span className="font-medium">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span className="font-medium">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span className="font-medium">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
            <span>tersisa</span>
        </div>
    );
};

export default function Checkout() {
    const { user } = useAuth();
    const { items, totalItems, clearCart } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [hasAddress, setHasAddress] = useState(true);
    const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dana');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: -6.5741124, lng: 106.6320672 });
    const [shippingCost, setShippingCost] = useState<number>(0);

    const steps: { title: string; description: string; status: StepStatus }[] = [
        {
            title: "Alamat",
            description: "Informasi pengiriman",
            status: currentStep === 'address' ? "current" : "complete"
        },
        {
            title: "Pembayaran",
            description: "Detail pembayaran",
            status: currentStep === 'payment' ? "current" : "upcoming"
        }
    ];

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        trigger,
        getValues
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            email: user?.email || '',
            streetName: '',
            landmark: '',
            province: '',
            city: '',
            postalCode: '',
            phone: '',
            cardNumber: '',
            expiry: '',
            cvv: '',
            message: '',
            district: '',
            addressType: '',
            rt: '',
            rw: ''
        }
    });

    useEffect(() => {
        if (!user) {
            toast.error('Silakan masuk untuk melanjutkan pembayaran');
            router.push('/signin');
            return;
        }

        const fetchUserAddress = async () => {
            try {
                const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();

                if (!userData?.addresses || userData.addresses.length === 0) {
                    setHasAddress(false);
                    return;
                }

                const primaryAddress = userData.addresses.find((addr: SavedAddress) => addr.isPrimary);

                if (primaryAddress) {
                    // Set form values from primary address
                    const formValues = {
                        firstName: primaryAddress.fullName,
                        email: user.email || '',
                        streetName: primaryAddress.streetName,
                        landmark: primaryAddress.landmark,
                        province: primaryAddress.province,
                        city: primaryAddress.city,
                        postalCode: primaryAddress.postalCode,
                        phone: primaryAddress.phone,
                        addressType: primaryAddress.addressType,
                        rt: primaryAddress.rt,
                        rw: primaryAddress.rw
                    };

                    // Set each form value
                    Object.entries(formValues).forEach(([key, value]) => {
                        setValue(key as keyof CheckoutFormData, value, { shouldValidate: true });
                    });

                    // Set coordinates from location object
                    if (primaryAddress.location?.lat && primaryAddress.location?.lng) {
                        const coords = {
                            lat: primaryAddress.location.lat,
                            lng: primaryAddress.location.lng
                        };
                        setCoordinates(coords);
                        const coordinatesStr = `${coords.lat},${coords.lng}`;
                        setValue('district', coordinatesStr, { shouldValidate: true });
                    }
                }
            } catch (error) {
                toast.error("Gagal memuat alamat tersimpan");
            }
        };

        fetchUserAddress();
    }, [user, router, setValue, getValues]);

    // Fetch shipping cost based on district
    useEffect(() => {
        const fetchShippingCost = async () => {
            if (!user) return;

            try {
                const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();

                if (!userData?.addresses || userData.addresses.length === 0) {
                    return;
                }

                const primaryAddress = userData.addresses.find((addr: SavedAddress) => addr.isPrimary);

                if (!primaryAddress?.location?.lat || !primaryAddress?.location?.lng) {
                    return;
                }

                // Use coordinates from location object
                const { lat, lng } = primaryAddress.location;

                // Set the coordinates for the map
                setCoordinates({ lat, lng });
                const coordinatesStr = `${lat},${lng}`;
                setValue('district', coordinatesStr, { shouldValidate: true });

                // Fetch shipping costs from ongkir collection
                const ongkirQuery = query(
                    collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_ONGKIR as string)
                );
                const ongkirSnapshot = await getDocs(ongkirQuery);

                // Find matching shipping cost
                const ongkirData = ongkirSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as OngkirData[];

                // Find the matching ongkir based on desa (village/area)
                const matchingOngkir = ongkirData.find(ongkir => {
                    // Convert both strings to lowercase for case-insensitive comparison
                    const ongkirDesa = ongkir.desa.toLowerCase();
                    const addressDesa = primaryAddress.location.address.toLowerCase();
                    return addressDesa.includes(ongkirDesa);
                });

                if (matchingOngkir) {
                    // Remove any non-numeric characters and convert to number
                    const price = parseInt(matchingOngkir.price.replace(/[^0-9]/g, ''));
                    setShippingCost(price);
                } else {
                    // If no match found, use the first ongkir as fallback
                    if (ongkirData.length > 0) {
                        const price = parseInt(ongkirData[0].price.replace(/[^0-9]/g, ''));
                        setShippingCost(price);
                    } else {
                        setShippingCost(0);
                    }
                }
            } catch (error) {
                toast.error("Gagal memuat biaya pengiriman");
            }
        };

        fetchShippingCost();
    }, [user, setValue]);

    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => {
            // Convert price from "5.000" to 5000
            const priceStr = item.price.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
            const price = parseInt(priceStr, 10); // Convert to integer
            return sum + (price * item.quantity);
        }, 0);
        return subtotal + shippingCost;
    };

    const generateTransactionId = () => {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TRX-${timestamp}-${random}`;
    };

    const onSubmit = async (data: CheckoutFormData) => {
        if (!user) {
            toast.error('Silakan masuk untuk melanjutkan pembayaran');
            router.push('/signin');
            return;
        }

        if (!items || items.length === 0) {
            toast.error('Keranjang Anda kosong. Silakan tambahkan item ke keranjang sebelum melanjutkan.');
            return;
        }

        if (!paymentProof) {
            toast.error('Silakan unggah bukti pembayaran');
            return;
        }

        setIsLoading(true);

        try {
            // Upload payment proof to ImageKit
            const formData = new FormData();
            formData.append('file', paymentProof);
            formData.append('fileName', `${user.uid}_${Date.now()}_${paymentProof.name}`);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Gagal mengunggah bukti pembayaran');
            }

            const { url } = await uploadResponse.json();

            // Get the current district value (coordinates)
            const districtValue = getValues('district');

            // Calculate order expiration time (24 hours from now)
            const orderDate = new Date();
            const expirationTime = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);

            // Create order data with transaction ID
            const total = calculateTotal();
            const orderData: TransactionData = {
                transactionId: generateTransactionId(),
                userId: user.uid,
                userInfo: {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                },
                items,
                totalAmount: total,
                shippingInfo: {
                    firstName: data.firstName,
                    email: data.email,
                    streetName: data.streetName,
                    landmark: data.landmark,
                    province: data.province,
                    city: data.city,
                    postalCode: data.postalCode,
                    phone: data.phone,
                    district: districtValue as string,
                    rt: data.rt,
                    rw: data.rw,
                    addressType: data.addressType
                },
                paymentInfo: {
                    method: paymentMethod,
                    proof: url,
                    status: 'pending'
                },
                message: data.message,
                orderDate: orderDate.toISOString(),
                expirationTime: expirationTime.toISOString(),
                status: 'success',
                deliveryStatus: {
                    status: 'pending',
                    history: [
                        {
                            status: 'pending',
                            timestamp: orderDate.toISOString(),
                            description: 'Order placed'
                        }
                    ],
                    estimatedDelivery: new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
                },
                shippingCost: shippingCost
            };

            try {
                // Save to transaction database
                const { id: transactionId } = await createTransaction(orderData);

                // Clear the cart after successful order
                clearCart();

                // Update success message to include countdown
                toast.success(
                    <div className="flex flex-col gap-2">
                        <p>Pesanan berhasil dibuat! Silakan tunggu konfirmasi.</p>
                        <CountdownTimer endTime={expirationTime.toISOString()} />
                    </div>
                );

                // Redirect to transaction page with the transaction ID
                router.push(`/transaction/${transactionId}`);
            } catch (error) {
                // If transaction creation fails, set status to failed
                orderData.status = 'failed';
                orderData.paymentInfo.status = 'rejected';

                toast.error('Gagal membuat pesanan. Silakan coba lagi.');
            }
        } catch (error) {
            toast.error('Gagal membuat pesanan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddressSubmit = async (data: Partial<CheckoutFormData>) => {
        setIsLoading(true);

        try {
            // Validate all fields
            const isValid = await trigger();

            if (!isValid) {
                toast.error('Silakan isi semua field yang diperlukan dengan benar');
                return;
            }

            // Move to payment step
            setCurrentStep('payment');
            toast.success('Melanjutkan ke langkah pembayaran');

            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            toast.error('Gagal melanjutkan ke langkah pembayaran');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentMethodChange = (method: PaymentMethod) => {
        setPaymentMethod(method);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <HeroCheckout />
            <section className="bg-gray-50 min-h-screen py-12">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Order Summary */}
                        <div className="lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
                            <Card className="p-8 bg-white shadow-sm border-0 rounded-2xl">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Ringkasan Pesanan</h2>
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 items-center">
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800 text-lg">{item.title}</h3>
                                                <p className="text-[#FF204E] font-semibold text-lg mt-1">{item.price}</p>
                                                <p className="text-sm text-gray-500 mt-1">Jumlah: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 mt-8 pt-6">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span className="font-medium">Total Item:</span>
                                        <span>{totalItems}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 text-gray-600">
                                        <span className="font-medium">Biaya Pengiriman:</span>
                                        <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-medium text-gray-800 text-lg">Total Pembayaran:</span>
                                        <span className="text-[#FF204E] font-bold text-xl">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Checkout Steps */}
                        <div>
                            <div className="mb-8">
                                <Steps steps={steps} />
                            </div>
                            {currentStep === 'address' ? (
                                <Card className="p-8 bg-white shadow-sm border-0 rounded-2xl">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-800">Informasi Pengiriman</h2>
                                        <Button
                                            variant="outline"
                                            className="text-[#FF204E] border-[#FF204E] hover:bg-[#FF204E] hover:text-white transition-colors duration-200"
                                            onClick={() => router.push('/profile/address')}
                                        >
                                            Edit Alamat
                                        </Button>
                                    </div>
                                    <form
                                        className="space-y-6"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const formData = getValues();

                                            try {
                                                await handleSubmit(handleAddressSubmit)(e);
                                            } catch (error) {
                                                toast.error('Terjadi kesalahan saat mengirim formulir');
                                            }
                                        }}
                                    >
                                        {!hasAddress && <NoAddressFound />}
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-gray-700">Nama Lengkap</Label>
                                            <Input
                                                id="firstName"
                                                {...register('firstName', { required: true })}
                                                className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register('email', { required: true })}
                                                className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="addressType" className="text-gray-700">Tipe Alamat</Label>
                                            <Input
                                                id="addressType"
                                                {...register('addressType', { required: true })}
                                                className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="streetName" className="text-gray-700">Nama Jalan</Label>
                                            <textarea
                                                id="streetName"
                                                className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#FF204E] focus:border-transparent transition-all duration-200 cursor-not-allowed"
                                                rows={3}
                                                {...register('streetName', { required: true })}
                                                readOnly
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="rt" className="text-gray-700">RT</Label>
                                                <Input
                                                    id="rt"
                                                    {...register('rt', { required: true })}
                                                    className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="rw" className="text-gray-700">RW</Label>
                                                <Input
                                                    id="rw"
                                                    {...register('rw', { required: true })}
                                                    className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="landmark" className="text-gray-700">Patokan</Label>
                                            <Input
                                                id="landmark"
                                                {...register('landmark', { required: true })}
                                                className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="province" className="text-gray-700">Provinsi</Label>
                                                <Input
                                                    id="province"
                                                    {...register('province', { required: true })}
                                                    className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="text-gray-700">Kota</Label>
                                                <Input
                                                    id="city"
                                                    {...register('city', { required: true })}
                                                    className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postalCode" className="text-gray-700">Kode Pos</Label>
                                            <Input
                                                id="postalCode"
                                                {...register('postalCode', { required: true })}
                                                className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Lokasi</Label>
                                            <div className="w-full h-[200px] rounded-xl overflow-hidden border border-gray-200">
                                                <iframe
                                                    title="Location Map"
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01}%2C${coordinates.lat - 0.002}%2C${coordinates.lng + 0.01}%2C${coordinates.lat + 0.002}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
                                                    allowFullScreen
                                                />
                                            </div>
                                            <input
                                                type="hidden"
                                                {...register('district')}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-gray-700">Nomor Telepon</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                {...register('phone')}
                                                className="bg-gray-100 border-gray-200 rounded-xl h-12 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-gray-700">Pesan (Opsional)</Label>
                                            <textarea
                                                id="message"
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#FF204E] focus:border-transparent transition-all duration-200"
                                                rows={4}
                                                placeholder="Tambahkan catatan atau permintaan khusus..."
                                                {...register('message')}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full mt-8 bg-[#FF204E] text-white hover:bg-[#e61e4d] h-14 rounded-xl text-lg font-medium transition-colors duration-200"
                                            disabled={isLoading || items.length === 0}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Memproses...
                                                </div>
                                            ) : (
                                                'Lanjut ke Pembayaran'
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            ) : (
                                <Card className="p-8 bg-white shadow-sm border-0 rounded-2xl">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-800">Informasi Pembayaran</h2>
                                        <Button
                                            variant="outline"
                                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                            onClick={() => setCurrentStep('address')}
                                        >
                                            Kembali ke Alamat
                                        </Button>
                                    </div>
                                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                        <PaymentOptions
                                            paymentMethod={paymentMethod}
                                            onPaymentMethodChange={handlePaymentMethodChange}
                                            total={calculateTotal()}
                                        />

                                        <div className="space-y-4">
                                            <Label className="text-gray-700">Unggah Bukti Pembayaran</Label>
                                            <div className="space-y-4">
                                                {!previewUrl ? (
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            htmlFor="payment-proof"
                                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                        >
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg
                                                                    className="w-8 h-8 mb-4 text-gray-500"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                                <p className="mb-2 text-sm text-gray-500">
                                                                    <span className="font-semibold">Klik untuk unggah</span> atau seret dan lepas
                                                                </p>
                                                                <p className="text-xs text-gray-500">PNG, JPG atau JPEG (MAKS. 2MB)</p>
                                                            </div>
                                                            <input
                                                                id="payment-proof"
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-64 border-2 border-gray-200 rounded-xl overflow-hidden">
                                                        <Image
                                                            src={previewUrl}
                                                            alt="Preview bukti pembayaran"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setPreviewUrl(null);
                                                                setPaymentProof(null);
                                                            }}
                                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                                {paymentProof && (
                                                    <p className="text-sm text-gray-500">
                                                        File terpilih: {paymentProof.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full mt-8 bg-[#FF204E] text-white hover:bg-[#e61e4d] h-14 rounded-xl text-lg font-medium transition-colors duration-200"
                                            disabled={isLoading || items.length === 0 || !paymentProof}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Memproses...
                                                </div>
                                            ) : (
                                                'Pesan Sekarang'
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
} 