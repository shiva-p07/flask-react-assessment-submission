export interface Task {
  id: string;
  account_id: string;
  title: string;
  description: string;
}

export interface CreateTaskParams {
  title: string;
  description: string;
}

export interface UpdateTaskParams {
  title: string;
  description: string;
}

export interface PaginationParams {
  page: number;
  size: number;
  offset: number;
}

export interface PaginatedTasksResponse {
  items: Task[];
  pagination_params: PaginationParams;
  total_count: number;
  total_pages: number;
}
