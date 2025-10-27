export interface ProductsData {
  id: string;
  title: string;
  price: string;
  shopeUrl: string;
  description: string;
  thumbnail: string;
  size: string | null;
  category: string;
  slug: string;
  content: string;
  sold: number;
  stock: number;
  ratings?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse {
  data: ProductsData[];
  pagination: Pagination;
}
