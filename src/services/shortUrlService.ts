import api from './api'
import type { IShortUrl, IMinimalPage } from '../types/shorturl';

export const shortUrlService = {
    getAll: async (page = 0, size = 10, sort?: string): Promise<IMinimalPage<IShortUrl>> => {
        const response = await api.get<IMinimalPage<IShortUrl>>('/short-url', {
            params: { page, size, sort },
        });
        return response.data;
    },

    create: async (url: string): Promise<IShortUrl> => {
        const response = await api.post<IShortUrl>('/short-url?url=' + url);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        const response = await api.delete(`/short-url/${id}`);
        return response.data;
    }
};
