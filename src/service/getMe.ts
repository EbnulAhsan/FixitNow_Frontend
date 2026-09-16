import { apiClient } from "@/lib/api-client";

export const getMe = async () => {
    try {
        const res = await apiClient.get("/auth/me");
        return res.data;
    } catch (error) {
        return null;
    }
};