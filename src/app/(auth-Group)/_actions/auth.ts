/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// --- LOGIN ACTION ---
export async function loginAction(formData: { email: string; password: string }) {
    try {
        const targetUrl = `${BACKEND_URL}/api/auth/login`;

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

        // 1. Resolve role from backend response body
        let role =
            data.data?.user?.role ||
            data.data?.role ||
            data.user?.role ||
            data.role;

        // 2. Fallback: Parse JWT payload
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
                console.error("Token decode error:", e);
            }
        }

        // 3. Fallback default
        if (!role) {
            role = "CUSTOMER";
        }

        const cookieStore = await cookies();
        cookieStore.set("token", accessToken, {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });

        cookieStore.set("role", role.toUpperCase(), {
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        });

        return {
            success: true,
            accessToken,
            role: role.toUpperCase(),
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

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Registration failed" };
        }

        const accessToken = data.data?.accessToken || data.token || data.accessToken;
        const role =
            data.data?.user?.role ||
            data.data?.role ||
            formData.role ||
            "CUSTOMER";

        if (accessToken) {
            const cookieStore = await cookies();
            cookieStore.set("token", accessToken, {
                path: "/",
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            });

            cookieStore.set("role", role.toUpperCase(), {
                path: "/",
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            });
        }

        return {
            success: true,
            message: data.message || "Registration successful!",
            accessToken,
            role: role.toUpperCase(),
        };
    } catch (error) {
        console.error("Register action error:", error);
        return { success: false, message: "Server connection failed. Is the backend running?" };
    }
}

// --- LOGOUT ACTION ---
export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("role");
    redirect("/login");
}