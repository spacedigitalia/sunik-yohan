export interface GalleryData {
  id: string;
  imageUrl: string;
  alt: string;
  createdAt: string;
}

export interface ApiResponse {
  data: GalleryData[];
}
