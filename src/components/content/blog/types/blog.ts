export interface BlogData {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  description: string;
  slug: string;
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
  data: BlogData[];
  pagination: Pagination;
}
