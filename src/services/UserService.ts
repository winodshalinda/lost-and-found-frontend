import {isAxiosError} from "axios";
import api from "./api";
import {UserIF} from "../types/User";

export const getAllUsers = async () => {
    try {
        const response = await api.get('user/getAllUsers');
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

export const updateUser = async (user: UserIF) => {
    try {
        const response = await api.patch(`user/change/${user.id}`, user);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

export const getUsersBySearchTerm = async (searchTerm: string) => {
    try {
        const response = await api.get(`user/search/${searchTerm}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}