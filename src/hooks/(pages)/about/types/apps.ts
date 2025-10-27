export interface Button {
  label: string;
  href: string;
}

export interface AppsData {
  id: string;
  title: string;
  text: string;
  description: string;
  button: Button;
  imageUrl: string;
  createdAt: string;
}

export interface ApiResponseApps {
  data: AppsData[];
}
