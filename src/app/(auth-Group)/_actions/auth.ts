/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function loginAction(formData: { email: string; password: string }) {
    try {
        const res = await axios.post(`${API_BASE}/auth/login`, formData);
        const data = res.data?.data;

        if (data?.accessToken) {
            const cookieStore = await cookies();

            cookieStore.set("token", data.accessToken, {
                httpOnly: false, // 
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            cookieStore.set("role", data.user.role, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            return { success: true, user: data.user };
        }

        return { success: false, message: res.data?.message || "Login failed" };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Invalid credentials",
        };
    }
}

export async function registerAction(formData: any) {
    try {
        const res = await axios.post(`${API_BASE}/auth/register`, formData);
        return { success: true, data: res.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Registration failed",
        };
    }
}