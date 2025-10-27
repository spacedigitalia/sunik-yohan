export interface ServicesData {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  data: ServicesData[];
}
