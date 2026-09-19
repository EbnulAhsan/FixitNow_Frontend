/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


export async function getAdminStatsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return { success: false, data: null };

        const res = await fetch(`${BACKEND_URL}/api/admin/stats`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        const data = await res.json();
        return { success: res.ok, data: data?.data || data };
    } catch (err: any) {
        return { success: false, message: err?.message };
    }
}

// User Management for all kind of users 
export async function getAllUsersAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return { success: false, data: [] };

        let res = await fetch(`${BACKEND_URL}/api/admin/users`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (!res.ok) {
            res = await fetch(`${BACKEND_URL}/api/users`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        return { success: res.ok, data: list };
    } catch (err: any) {
        return { success: false, data: [] };
    }
}


// Ban and  Unban User Status Toggle
export async function toggleUserStatusAction(userId: string, currentStatus: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return { success: false, message: "Unauthorized: Please login as admin" };

        const isBlocked = currentStatus === "BLOCKED" || currentStatus === "BANNED";
        const action = isBlocked ? "unblock" : "block";

        const targetUrl = `${BACKEND_URL}/api/admin/users/${userId}/${action}`;

        const res = await fetch(targetUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        revalidatePath("/admin-dashboard");
        revalidatePath("/admin-dashboard/users");

        return {
            success: res.ok,
            message: data?.message || (res.ok ? `User ${action}ed successfully` : `Failed to ${action} user`),
        };
    } catch (err: any) {
        console.error("Status toggle error:", err);
        return { success: false, message: err?.message || "Connection failed" };
    }
}

// Category Management Actions for all kind of categories
export async function getAllCategoriesAction() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/categories`, {
            method: "GET",
            cache: "no-store",
        });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        return { success: res.ok, data: list };
    } catch (err: any) {
        return { success: false, data: [] };
    }
}

export async function createCategoryAction(formData: { name: string; description?: string }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${BACKEND_URL}/api/categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        revalidatePath("/admin-dashboard/categories");
        return { success: res.ok, message: data?.message || "Category created", data };
    } catch (err: any) {
        return { success: false, message: err?.message || "Creation failed" };
    }
}