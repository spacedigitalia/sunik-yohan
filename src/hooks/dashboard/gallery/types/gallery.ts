export interface galleryPropes {
  id: string;
  imageUrl: string;
}

export interface EditModalProps {
  item: {
    id: string;
    imageUrl: string;
  };
  onSubmit: (data: { id: string; image: File }) => Promise<void>;
}
