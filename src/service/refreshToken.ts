import { apiClient } from "@/lib/api-client";
import { getCookie, setCookie } from "cookies-next";

export const refreshAuthToken = async () => {
    try {
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) return null;

        const res = await apiClient.post("/auth/refresh-token", {
            refreshToken,
        });

        if (res.data?.data?.accessToken) {
            setCookie("token", res.data.data.accessToken);
            return res.data.data.accessToken;
        }
        return null;
    } catch (error) {
        return null;
    }
};