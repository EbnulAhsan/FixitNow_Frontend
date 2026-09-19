import { getCookie } from "cookies-next";


const getSafeBaseUrl = () => {
    const raw = process.env.NEXT_PUBLIC_API_URL || "";
    if (!raw || raw.includes("localhost") || raw.includes("127.0.0.1")) {
        return "https://fixitnow-backend-rkod.onrender.com/api";
    }
    const clean = raw.replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
};

const API_BASE_URL = getSafeBaseUrl();

interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...customOptions } = options;

    // এন্ডপয়েন্টের শুরুর স্ল্যাশ ঠিক রাখা
    const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    let url = `${API_BASE_URL}${formattedEndpoint}`;

    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const token = getCookie("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customOptions.headers,
    };

    const response = await fetch(url, {
        ...customOptions,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong with the API request.");
    }

    return data;
}