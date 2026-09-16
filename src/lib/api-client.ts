import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


apiClient.interceptors.request.use((config) => {
    const token = getCookie("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            deleteCookie("token");
            deleteCookie("role");
        }
        return Promise.reject(error);
    }
);