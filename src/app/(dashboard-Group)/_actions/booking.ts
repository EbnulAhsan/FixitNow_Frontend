"use server";

import { cookies } from "next/headers";

export async function getCustomerBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "No token found", data: [] };
        }


        const response = await fetch("http://localhost:5000/api/bookings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return { success: false, data: [] };
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data || (Array.isArray(data) ? data : []),
        };
    } catch (error) {
        console.error("Fetch booking server error:", error);
        return { success: false, data: [] };
    }
}

