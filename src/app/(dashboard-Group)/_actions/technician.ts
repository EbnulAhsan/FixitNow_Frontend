/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

// Technician-er assigned bookings fetch kora
export async function getTechnicianBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, data: [] };

        const response = await fetch("http://localhost:5000/api/bookings/technician-bookings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data?.message || "Failed to fetch bookings", data: [] };
        }

        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data?.data?.data)) list = data.data.data;
        else if (Array.isArray(data?.data?.result)) list = data.data.result;
        else if (Array.isArray(data?.result)) list = data.result;

        return { success: true, data: list };
    } catch (error) {
        console.error("Technician fetch error:", error);
        return { success: false, data: [] };
    }
}

// Technician booking status update kora (ACCEPTED, DECLINED, COMPLETED)
export async function updateBookingStatusAction(bookingId: string, status: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, message: "Unauthorized" };

        let response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
        }

        const resData = await response.json();
        return {
            success: response.ok,
            message: resData?.message || (response.ok ? "Status updated" : "Failed to update"),
            data: resData?.data || resData,
        };
    } catch (error) {
        console.error("Status update error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

// Public/Customer-er jonne sob technicians list kora (Dynamic ID pawar jonno)
export async function getAllTechniciansAction() {
    try {
        const response = await fetch("http://localhost:5000/api/technicians", {
            method: "GET",
            cache: "no-store",
        });
        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        return { success: response.ok, data: list };
    } catch (error) {
        console.error("Fetch technicians error:", error);
        return { success: false, data: [] };
    }
}