import * as z from "zod";

export type AddressFormData = z.infer<typeof addressSchema>;

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  province: string;
  city: string;
  postalCode: string;
}

export interface SavedAddress {
  fullName: string;
  phone: string;
  streetName: string;
  landmark: string;
  addressType: "home" | "office";
  province: string;
  city: string;
  postalCode: string;
  rt: string;
  rw: string;
  location: LocationData;
  createdAt: string;
  isPrimary?: boolean;
}

// Form validation schema
export const addressSchema = z.object({
  fullName: z.string().min(3, "Nama harus minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon harus minimal 10 digit"),
  streetName: z.string().min(10, "Nama jalan harus minimal 10 karakter"),
  landmark: z.string().min(3, "Patokan harus minimal 3 karakter"),
  addressType: z.enum(["home", "office"], {
    required_error: "Tipe alamat harus dipilih",
  }),
  province: z.string().min(1, "Provinsi harus dipilih"),
  city: z.string().min(1, "Kota harus dipilih"),
  postalCode: z.string().min(5, "Kode pos harus minimal 5 digit"),
  rt: z.string().min(1, "RT harus diisi"),
  rw: z.string().min(1, "RW harus diisi"),
});
