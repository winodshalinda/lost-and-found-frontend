import api from './api';
import {isAxiosError} from "axios";
import {RequestIF} from "../types/RequestIF";

export const requestItem = async (request: RequestIF) => {
    try {
        const response = await api.post(`/request`, request);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

export const updateRequest = async (request: RequestIF) => {
    try {
        const response = await api.patch(`request/${request.requestId}`, request);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
    }
}

export const getAllRequests = async () => {
    try {
        const response = await api.get(`/request/getAllRequests`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

export const approveRequest = async (requestId: string) => {
    try {
        const response = await api.patch(`/request/approve/${requestId}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}
export const rejectRequest = async (requestId: string) => {
    try {
        const response = await api.patch(`/request/reject/${requestId}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

export const getRequestBySearchTerm = async (searchTerm: string) => {
    try {
        const response = await api.get(`/request/search/${searchTerm}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

export const getRequestByUser = async (userId: string) => {
    try {
        const response = await api.get(`/request/getUserRequests/${userId}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}