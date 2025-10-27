export interface testimonialsData {
  id: string;
  name: string;
  job: string;
  message: string;
  imageUrl: string;
  createdAt: string;
}

export interface ApiResponseTestimonials {
  data: testimonialsData[];
}
