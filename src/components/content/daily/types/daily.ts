export interface DailySchedule {
  id: string;
  title: string;
  times: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  data: DailySchedule[];
}
