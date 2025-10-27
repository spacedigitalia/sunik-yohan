export interface Button {
  label: string;
  href: string;
}

export interface AboutData {
  id: string;
  button: Button;
  createdAt: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface ApiResponse {
  data: AboutData[];
}
