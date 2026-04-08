import type { ISignUpRequest, ISignInRequest } from '../types/account';
import api from './api';

export const postUser = async (body: ISignUpRequest): Promise<void> => {
    const response = await api.post('/users', body);
    return response.data;
}

export const checkEmailExists = async (email: string): Promise<boolean> => {
    const response = await api.get<boolean>('/users/exists', {
        params: { email },
    });
    return response.data;
}

export const checkUsernameExists = async (username: string): Promise<boolean> => {
    const response = await api.get<boolean>('/users/exists', {
        params: { username },
    });
    return response.data;
}

export const postLogin = async (body: ISignInRequest): Promise<string> => {
    const response = await api.post('/auth/login', body);
    return response.data;
}
