/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// --- LOGIN ACTION ---
export async function loginAction(formData: { email: string; password: string }) {
    try {
        const targetUrl = `${BACKEND_URL}/api/auth/login`;
        console.log("Hitting Backend URL:", targetUrl);

        const response = await fetch(targetUrl, {
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

        const accessToken = data.data?.accessToken || data.token || data.accessToken;

        if (!accessToken) {
            return { success: false, message: "Token not received from server" };
        }

        // 1. First priority: Check role directly from backend response
        let role = data.data?.user?.role || data.data?.role || data.user?.role;

        // 2. Fallback: Decode JWT payload if not directly in response body
        if (!role) {
            try {
                const base64Url = accessToken.split(".")[1];
                if (base64Url) {
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
                }
            } catch (e) {
                console.error("Token decode error", e);
            }
        }

        // Default fallback if still unresolved
        if (!role) {
            role = "CUSTOMER";
        }

        // Set cookies for Next.js middleware & server actions
        const cookieStore = await cookies();
        cookieStore.set("token", accessToken, {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        cookieStore.set("role", role, {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
        });

        return {
            success: true,
            accessToken,
            role,
            user: data.data?.user || data.user,
        };
    } catch (error) {
        console.error("Login action error:", error);
        return {
            success: false,
            message: "Server connection failed. Is the backend running?",
        };
    }
}

// --- REGISTER ACTION ---
export async function registerAction(formData: any) {
    try {
        const targetUrl = `${BACKEND_URL}/api/auth/register`;
        console.log("Hitting Backend URL:", targetUrl);

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Registration failed" };
        }

        const accessToken = data.data?.accessToken || data.token;
        const role = data.data?.user?.role || data.data?.role || formData.role || "CUSTOMER";

        if (accessToken) {
            const cookieStore = await cookies();
            cookieStore.set("token", accessToken, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
            cookieStore.set("role", role, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
        }

        return {
            success: true,
            message: data.message || "Registration successful!",
            accessToken,
            role,
        };
    } catch (error) {
        console.error("Register action error:", error);
        return { success: false, message: "Server connection failed. Is the backend running?" };
    }
}