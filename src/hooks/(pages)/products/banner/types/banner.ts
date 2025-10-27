export interface BannerData {
  id: string;
  imageUrl:string;
  updatedAt: string;
}

export interface ApiResponse {
  data: BannerData[];
}
