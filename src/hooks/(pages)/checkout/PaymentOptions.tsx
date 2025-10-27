import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type PaymentMethod = 'dana' | 'shopeepay' | 'seabank';

interface PaymentOptionsProps {
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    total: number;
}

export default function PaymentOptions({ paymentMethod, onPaymentMethodChange, total }: PaymentOptionsProps) {
    const handleCopy = (number: string, type: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(number);
        toast.success(`Nomor ${type} berhasil disalin!`);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label className="text-gray-700">Pilih Metode Pembayaran</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* DANA */}
                    <div
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'dana'
                            ? 'border-[#FF204E] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => onPaymentMethodChange('dana')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-[#FF204E]">DANA</span>
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium text-gray-800">DANA</h3>
                                <p className="text-sm text-gray-500">E-Wallet</p>
                            </div>
                        </div>
                    </div>

                    {/* SHOPEEPAY */}
                    <div
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'shopeepay'
                            ? 'border-[#FF204E] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => onPaymentMethodChange('shopeepay')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-[#FF204E]">SP</span>
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium text-gray-800">SHOPEEPAY</h3>
                                <p className="text-sm text-gray-500">E-Wallet</p>
                            </div>
                        </div>
                    </div>

                    {/* SEABANK */}
                    <div
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'seabank'
                            ? 'border-[#FF204E] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => onPaymentMethodChange('seabank')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-[#FF204E]">SB</span>
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium text-gray-800">SEABANK</h3>
                                <p className="text-sm text-gray-500">Bank Transfer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800">Detail Pembayaran</h3>
                <div className="space-y-4">
                    {paymentMethod === 'dana' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-600">Nomor DANA</p>
                                    <p className="text-lg font-semibold">081284258290</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => handleCopy('081284258290', 'DANA', e)}
                                    className="p-2 text-gray-500 hover:text-[#FF204E] transition-colors flex items-center"
                                    title="Salin nomor"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Salin
                                </button>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                                <h4 className="font-medium text-gray-800 mb-2">Cara Pembayaran DANA:</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    <li>Buka aplikasi DANA di smartphone Anda</li>
                                    <li>Pilih menu "Kirim"</li>
                                    <li>Masukkan nomor DANA: 081284258290</li>
                                    <li>Masukkan nominal sesuai total pembayaran</li>
                                    <li>Tambahkan catatan: "Pembayaran Order"</li>
                                    <li>Konfirmasi dan selesaikan pembayaran</li>
                                    <li>Simpan bukti pembayaran</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'shopeepay' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-600">Nomor SHOPEEPAY</p>
                                    <p className="text-lg font-semibold">081284258290</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => handleCopy('081284258290', 'SHOPEEPAY', e)}
                                    className="p-2 text-gray-500 hover:text-[#FF204E] transition-colors flex items-center"
                                    title="Salin nomor"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Salin
                                </button>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                                <h4 className="font-medium text-gray-800 mb-2">Cara Pembayaran SHOPEEPAY:</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    <li>Buka aplikasi Shopee di smartphone Anda</li>
                                    <li>Pilih menu "SHOPEEPAY"</li>
                                    <li>Pilih "Kirim" atau "Transfer"</li>
                                    <li>Masukkan nomor SHOPEEPAY: 081284258290</li>
                                    <li>Masukkan nominal sesuai total pembayaran</li>
                                    <li>Tambahkan catatan: "Pembayaran Order"</li>
                                    <li>Konfirmasi dan selesaikan pembayaran</li>
                                    <li>Simpan bukti pembayaran</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'seabank' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-600">Nomor Rekening SEABANK</p>
                                    <p className="text-lg font-semibold">901560161550</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => handleCopy('901560161550', 'SEABANK', e)}
                                    className="p-2 text-gray-500 hover:text-[#FF204E] transition-colors flex items-center"
                                    title="Salin nomor"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Salin
                                </button>
                            </div>
                            <div className="p-4 bg-white rounded-xl">
                                <h4 className="font-medium text-gray-800 mb-2">Cara Pembayaran SEABANK:</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    <li>Buka aplikasi SEABANK di smartphone Anda</li>
                                    <li>Pilih menu "Transfer"</li>
                                    <li>Pilih "Transfer ke Bank"</li>
                                    <li>Masukkan nomor rekening: 901560161550</li>
                                    <li>Masukkan nominal sesuai total pembayaran</li>
                                    <li>Tambahkan catatan: "Pembayaran Order"</li>
                                    <li>Konfirmasi dan selesaikan pembayaran</li>
                                    <li>Simpan bukti pembayaran</li>
                                </ol>
                            </div>
                        </div>
                    )}
                    <div className="p-4 bg-white rounded-xl">
                        <h4 className="font-medium text-gray-800 mb-2">Penting:</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                            <li>Pastikan nominal transfer sesuai dengan total pembayaran</li>
                            <li>Simpan bukti pembayaran untuk konfirmasi</li>
                            <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
                            <li>Untuk bantuan, hubungi customer service kami</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-white rounded-xl">
                        <p className="text-sm text-gray-500">Total Pembayaran</p>
                        <p className="text-2xl font-bold text-[#FF204E]">Rp {total.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 