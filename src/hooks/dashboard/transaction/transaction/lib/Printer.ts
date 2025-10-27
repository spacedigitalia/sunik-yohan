import { useState, useEffect } from 'react';

import { toast } from 'sonner';

import { TransactionData } from '@/utils/firebase/transaction';

declare global {
    interface Navigator {
        bluetooth: {
            requestDevice(options: {
                filters: Array<{
                    services?: string[];
                    name?: string;
                }>;
                optionalServices?: string[];
            }): Promise<BluetoothDevice>;
        };
    }
}

// Add BluetoothDevice interface
interface BluetoothDevice extends EventTarget {
    id: string;
    name: string;
    gatt: {
        connected: boolean;
        connect(): Promise<void>;
        getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
    };
}

interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
    writeValue(data: BufferSource): Promise<void>;
}

interface PrinterInfo {
    id: string;
    name: string;
    lastConnected: string;
}

export const usePrinter = () => {
    const [bluetoothDevice, setBluetoothDevice] = useState<BluetoothDevice | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // menambahkan fungsi untuk menyimpan info printer ke localStorage
    const savePrinterToLocalStorage = (device: BluetoothDevice) => {
        try {
            localStorage.setItem('printerInfo', JSON.stringify({
                id: device.id,
                name: device.name,
                lastConnected: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error saving printer info to localStorage:', error);
        }
    };

    // menambahkan fungsi untuk mendapatkan info printer dari localStorage
    const getPrinterFromLocalStorage = (): PrinterInfo | null => {
        try {
            const printerInfo = localStorage.getItem('printerInfo');
            return printerInfo ? JSON.parse(printerInfo) : null;
        } catch (error) {
            console.error('Error getting printer info from localStorage:', error);
            return null;
        }
    };

    useEffect(() => {
        if (bluetoothDevice) {
            setIsConnected(bluetoothDevice.gatt.connected);

            bluetoothDevice.addEventListener("gattserverdisconnected", () => {
                setIsConnected(false);
                setBluetoothDevice(null);
            });
        } else {
            setIsConnected(false);
        }
    }, [bluetoothDevice]);

    const handlePrint = async (transaction?: TransactionData) => {
        try {
            console.log('Starting print process...', { transaction });

            let device = bluetoothDevice;

            if (!device || !device.gatt.connected) {
                console.log('Requesting Bluetooth device...');
                device = await navigator.bluetooth.requestDevice({
                    filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
                    optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
                });

                console.log('Connecting to device...', device);
                await device.gatt.connect();
                setBluetoothDevice(device);
                setIsConnected(true);
                // Simpan info printer ke localStorage setelah koneksi berhasil
                savePrinterToLocalStorage(device);
            }

            if (!transaction) {
                console.log('No transaction provided, just connecting printer');
                toast.success("Printer berhasil terhubung!");
                return;
            }

            // Validate transaction data
            if (!transaction.items) {
                toast.error("Data transaksi tidak valid: items tidak ditemukan");
                return;
            }

            if (!Array.isArray(transaction.items)) {
                toast.error("Data transaksi tidak valid: format items salah");
                return;
            }

            if (transaction.items.length === 0) {
                toast.error("Data transaksi tidak valid: tidak ada items");
                return;
            }

            // Filter out invalid items before processing
            const validItems = transaction.items.filter(item => {
                if (!item) {
                    return false;
                }
                if (typeof item !== 'object') {
                    return false;
                }
                if (!item.title || !item.quantity || !item.price) {
                    return false;
                }
                return true;
            });

            if (validItems.length === 0) {
                toast.error("Data transaksi tidak valid: tidak ada item yang valid");
                return;
            }

            const service = await device.gatt.getPrimaryService(
                "000018f0-0000-1000-8000-00805f9b34fb"
            );

            const characteristic = await service.getCharacteristic(
                "00002af1-0000-1000-8000-00805f9b34fb"
            );

            const receiptParts = [
                [
                    "\x1B\x40", // Initialize printer
                    "\x1B\x61\x01", // Center alignment
                    "\x1B\x21\x30", // Larger text (double height + double width)
                    "SUNIK YOHAN\n",
                    "\x1B\x21\x00", // Normal text
                    "Minuman & Makanan\n",
                    "\n",
                    "Kp dukuh, RT.03/RW.08, Cibadak\n",
                    "Kec. Ciampea, Kab. Bogor\n",
                    "Jawa Barat 16620\n",
                    "Telp: 0812-8425-8290\n",
                    "Website: sunikyohan.my.id\n",
                    "\n",
                    "================================\n",
                    "\x1B\x21\x10", // Double width
                    "STRUK PEMBELIAN\n",
                    "\x1B\x21\x00", // Normal text
                    "\x1B\x61\x00", // Left alignment
                    `No.: ${transaction.transactionId || 'N/A'}\n`,
                    `Tgl: ${new Date(transaction.orderDate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}\n`,
                    `Jam: ${new Date(transaction.orderDate).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}\n`,
                    "================================\n",
                ].join(""),
            ];

            receiptParts.push(
                "Nama Barang     Qty      Harga\n" +
                "================================\n"
            );

            console.log('Processing items...');
            for (const item of validItems) {
                const itemName = item.title;
                const quantity = item.quantity.toString();
                const price = `Rp.${(item.price)}`;

                let itemLines = "";

                if (itemName.length > 15) {
                    itemLines += `${itemName.slice(0, 15)}\n`;
                    itemLines += `${itemName.slice(15).padEnd(15)}`;
                } else {
                    itemLines += itemName.padEnd(15);
                }

                itemLines += `${quantity.padStart(3)}  `;
                itemLines += `${price.padStart(10)}\n`;

                receiptParts.push(itemLines);
            }

            // Calculate totals
            const subtotal = transaction.totalAmount - transaction.shippingCost;
            const shippingCost = transaction.shippingCost || 0;
            const total = transaction.totalAmount || 0;

            console.log('Calculated amounts:', { subtotal, shippingCost, total });

            receiptParts.push(
                [
                    "================================\n",
                    "\x1B\x45\x01", // Bold on
                    `SUBTOTAL   : Rp ${subtotal.toLocaleString('id-ID')}\n`,
                    `PENGIRIMAN : Rp ${shippingCost.toLocaleString('id-ID')}\n`,
                    `TOTAL      : Rp ${total.toLocaleString('id-ID')}\n`,
                    "\x1B\x45\x00", // Bold off
                    "================================\n",
                    "\x1B\x61\x01", // Center alignment
                    "\n",
                    "Terima kasih atas kunjungan Anda\n",
                    "SELAMAT BERBELANJA KEMBALI\n",
                    "\n",
                    "* Barang yang sudah dibeli *\n",
                    "* tidak dapat ditukar/dikembalikan *\n",
                    "\n\n\n", // Paper feed
                    "\x1D\x56\x41\x03", // Cut paper
                ].join("")
            );

            console.log('Writing to printer...');
            const encoder = new TextEncoder();
            for (const part of receiptParts) {
                const data = encoder.encode(part);
                await characteristic.writeValue(data);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            toast.success("Printing started!");
        } catch (error: any) {
            console.error("Printing error:", error);
            console.error("Error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            setIsConnected(false);
            setBluetoothDevice(null);
            if (error.name === "NotFoundError" || error.name === "NetworkError") {
                toast.error("Printer tidak ditemukan. Silakan hubungkan ulang printer.");
            } else {
                toast.error("Gagal mencetak. Silakan cek koneksi printer Anda.");
            }
        }
    };

    const getButtonText = () => {
        if (isConnected && bluetoothDevice) {
            return `Printer: ${bluetoothDevice.name} (Terhubung)`;
        }
        const savedPrinter = getPrinterFromLocalStorage();
        if (savedPrinter) {
            return `Printer: ${savedPrinter.name} (Terakhir terhubung: ${new Date(savedPrinter.lastConnected).toLocaleString('id-ID')})`;
        }
        return "Hubungkan Printer";
    };

    return {
        bluetoothDevice,
        isConnected,
        handlePrint,
        getButtonText
    };
};
