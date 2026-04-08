import api from './api'
import type { IShortUrl, IShortUrlResponse } from '../types/shorturl';
import type { IApiResponse } from '../types/common';

export const shortUrlService = {
    getAll: async (): Promise<IShortUrlResponse> => {
        const response = await api.get<IShortUrlResponse>('/short-url');
        return response.data;
    },

    create: async (url: string): Promise<IApiResponse<IShortUrl>> => {
        const response = await api.post<IApiResponse<IShortUrl>>('/short-url?url=' + url);
        return response.data;
    },

    delete: async (id: number): Promise<IApiResponse<void>> => {
        const response = await api.delete(`/short-url/${id}`);
        return response.data;
    }
};