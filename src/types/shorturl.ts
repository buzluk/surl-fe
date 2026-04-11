export interface IShortUrl {
  id: number;
  originalUrl: string;
  fullShortUrl: string;
  createdAt: string; 
}

export interface IMinimalPage<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}