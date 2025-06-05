import {isAxiosError} from "axios";
import {ItemIF, ItemStatus} from "../types/ItemIF";
import api from "./api";

const getAllItems = async () => {
    try {
        const items = await api.get('/item/getAllItems');
        return items.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

const getItemByUser = async (userId: string) => {
    try {
        const response = await api.get(`/item/getItemsByUserId/${userId}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

const getItemByStatus = async (status: ItemStatus) => {
    try {
        const items = await api.get(`/item/getItemsByStatus/${status}`);
        return items.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

const createItem = async (item: ItemIF, imgFile: File | null) => {

    if (!imgFile) {
        throw new Error("Please select an image file");
    }

    try {
        const formData = new FormData();
        formData.append('itemDTO', new Blob([JSON.stringify(item)], {type: 'application/json'}));
        formData.append('imgFile', imgFile);

        const response = await api.post('/item', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

const updateItem = async (item: ItemIF, imgFile: File | null) => {

    try {

        if (imgFile) {
            const formData = new FormData();
            formData.append('imgFile', imgFile);

            await api.patch(`/item/updateItemImg/${item.itemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        const response = await api.patch(`/item/${item.itemId}`, item);
        return response.data;

    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

const deleteItem = async (item: ItemIF) => {
    try {
        return await api.delete(`/item/${item.itemId}`);
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw new Error(
            "Something went wrong. Please try again later."
        )
    }
}

const getItemById = async (itemId: string) => {
    try {
        const response = await api.get(`/item/${itemId}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

const getItemsBySearch = async (search: string) => {
    try {
        const response = await api.get(`/item/search/${search}`);
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw new Error(`${e.response?.data}`);
        }
        throw e;
    }
}

export {getAllItems, getItemByUser, getItemByStatus, createItem, updateItem, deleteItem, getItemById, getItemsBySearch}
