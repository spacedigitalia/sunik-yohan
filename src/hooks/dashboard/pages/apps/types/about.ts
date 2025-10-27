export interface AppsProps {
  id: string;
  title: string;
  text: string;
  description: string;
  imageUrl: string;
  button: {
    label: string;
    href: string;
  };
  createdAt: string;
}
