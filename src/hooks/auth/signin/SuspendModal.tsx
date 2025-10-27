import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface SuspendModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    suspendedEmail: string;
    onContactAdmin: () => void;
}

export default function SuspendModal({ isOpen, onOpenChange, suspendedEmail, onContactAdmin }: SuspendModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center text-center">
                    {/* SVG Illustration */}
                    <div className="w-32 h-32 mb-4">
                        <svg
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full text-blue-500"
                        >
                            <path
                                d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
                                fill="currentColor"
                                fillOpacity="0.1"
                            />
                            <path
                                d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z"
                                fill="currentColor"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M100 120C110.493 120 119 111.493 119 101C119 90.5066 110.493 82 100 82C89.5066 82 81 90.5066 81 101C81 111.493 89.5066 120 100 120Z"
                                fill="currentColor"
                            />
                            <path
                                d="M100 40V60"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <path
                                d="M100 140V160"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <path
                                d="M40 100H60"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <path
                                d="M140 100H160"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            Akun Tidak Aktif
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 mt-2">
                            Maaf, akun dengan email <span className="font-semibold text-gray-700">{suspendedEmail}</span> saat ini tidak aktif. Silakan hubungi administrator melalui WhatsApp untuk mengaktifkan kembali akun Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex flex-col gap-3 w-full">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full border-gray-200 hover:bg-gray-50"
                        >
                            Tutup
                        </Button>
                        <Button
                            variant="default"
                            onClick={onContactAdmin}
                            className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Hubungi Admin via WhatsApp
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
