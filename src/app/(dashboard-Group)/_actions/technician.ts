/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export async function getTechnicianBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, data: [] };

        let response = await fetch("http://localhost:5000/api/technician/bookings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            response = await fetch("http://localhost:5000/api/bookings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });
        }

        const data = await response.json();
        const list = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
                ? data.data
                : data.data?.data || [];

        return { success: true, data: list };
    } catch (error) {
        console.error("Technician fetch error:", error);
        return { success: false, data: [] };
    }
}

export async function updateBookingStatusAction(
    bookingId: string,
    status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, message: "Unauthorized" };

        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        let resData: any = {};
        try {
            resData = await response.json();
        } catch {
            // empty response fallback
        }

        if (!response.ok) {
            const fallback = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!fallback.ok) {
                return { success: false, message: resData.message || "Failed to update booking status" };
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Status update error:", error);
        return { success: false, message: "Server connection failed" };
    }
}