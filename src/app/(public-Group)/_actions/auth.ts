"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function loginAction(formData: { email: string; password: string }) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Invalid email or password",
            };
        }


        const accessToken = data.data?.accessToken || data.token;

        if (!accessToken) {
            return { success: false, message: "Token not received from server" };
        }


        let role = "CUSTOMER";
        try {
            const base64Url = accessToken.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const decodedToken = JSON.parse(jsonPayload);
            if (decodedToken.role) {
                role = decodedToken.role;
            }
        } catch (e) {
            console.error("Failed to decode token", e);
        }


        const cookieStore = await cookies();
        cookieStore.set({
            name: "token",
            value: accessToken,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        cookieStore.set({
            name: "role",
            value: role,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return {
            success: true,
            user: { role, email: formData.email },
        };
    } catch (error) {
        return {
            success: false,
            message: "Server connection failed. Please check if backend is running.",
        };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("role");
}