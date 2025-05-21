
export * from './auth';
export * from './navigation';
export * from './chat';

export interface ActionState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResult<T = any> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
