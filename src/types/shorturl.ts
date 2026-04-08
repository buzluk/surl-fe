export interface IShortUrl {
  id: number;
  originalUrl: string;
  fullShortUrl: string;
  createdAt: string; 
}

export interface IShortUrlResponse {
    content: IShortUrl[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            unsorted: boolean;
            sorted: boolean;
        };
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    numberOfElements: number;
    empty: boolean;
}