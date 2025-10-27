export interface Button {
  label: string;
  href: string;
}

export interface HomeData {
  id: string;
  span: string;
  text: string;
  title: string;
  imageUrl: string;
  description: string;
  button: Button;
  createdAt: string;
}

export interface ApiResponse {
  data: HomeData[];
}
