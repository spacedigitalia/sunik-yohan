import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Loader2 } from "lucide-react"

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, isLoading = false }: DeleteAccountModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Important</DialogTitle>
                </DialogHeader>

                <div className="text-sm text-muted-foreground space-y-3">
                    <p>Dengan klik &apos;Melanjutkan&apos;, kamu setuju bahwa:</p>

                    <ul className="list-disc pl-5 space-y-2">
                        <li>Setelah akun dihapus, kamu tidak dapat log in kembali dan melihat riwayat akun. Akun yang telah dihapus tidak dapat dikembalikan.</li>
                        <li>Koin yang tersisa akan hangus.</li>
                        <li>Penghapusan akun tidak dapat dilakukan jika kamu memiliki pesanan, penjualan dan/atau hal lain yang belum selesai, termasuk urusan hukum.</li>
                        <li>Setelah akunmu dihapus, kami mungkin masih menyimpan data tertentu sesuai dengan Kebijakan Privasi dan peraturan yang berlaku.</li>
                        <li>Kami berhak untuk menolak permintaan pembuatan akun baru olehmu di kemudian hari.</li>
                        <li>Penghapusan akun tidak membebaskanmu dari kewajiban dan/atau tanggung jawab yang masih berjalan.</li>
                    </ul>
                </div>

                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Memproses...
                            </span>
                        ) : (
                            'Melanjutkan'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}