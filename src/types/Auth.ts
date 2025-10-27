export enum Role {
  ADMIN = "admins",
  USER = "user",
}

export interface Address {
  addressType: string;
  city: string;
  createdAt: string;
  fullName: string;
  isPrimary: boolean;
  landmark: string;
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
    postalCode: string;
    province: string;
  };
  phone: string;
  postalCode: string;
  province: string;
  rt: string;
  rw: string;
  streetName: string;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  photoURL?: string;
  updatedAt: Date;
  isActive: boolean;
  phoneNumber: string;
  createdAt: Date;
  addresses?: Address[];
}

export interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserAccount>;
  loginWithGoogle: () => Promise<UserAccount>;
  loginWithGithub: () => Promise<UserAccount>;
  loginWithFacebook: () => Promise<UserAccount>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  getDashboardUrl: (userRole: string) => string;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    phone: string
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  showInactiveModal: boolean;
  setShowInactiveModal: (show: boolean) => void;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
