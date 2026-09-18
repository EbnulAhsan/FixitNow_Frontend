/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Technician-er assigned bookings fetch kora
export async function getTechnicianBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, data: [] };

        const response = await fetch(`${BACKEND_URL}/api/bookings/technician-bookings`, {
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

// Technician booking status update kora (ACCEPTED, DECLINED, IN_PROGRESS, COMPLETED)
export async function updateBookingStatusAction(bookingId: string, status: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, message: "Unauthorized" };

        let response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
        }

        const resData = await response.json();
        revalidatePath("/technician-dashboard");

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
        const response = await fetch(`${BACKEND_URL}/api/technicians`, {
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

// Technician Availability fetch kora
export async function getTechnicianAvailabilityAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, message: "Unauthorized", data: null };

        const response = await fetch(`${BACKEND_URL}/api/technicians/availability`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const data = await response.json();
        return { success: response.ok, data: data?.data || data };
    } catch (error: any) {
        console.error("Get availability error:", error);
        return { success: false, message: error?.message || "Failed to load availability", data: null };
    }
}

// Technician Availability update kora
export async function updateTechnicianAvailabilityAction(payload: {
    workingDays: string[];
    timeSlots: string[];
    isAvailableToday?: boolean;
}) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, message: "Unauthorized" };

        let response = await fetch(`${BACKEND_URL}/api/technicians/availability`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            response = await fetch(`${BACKEND_URL}/api/technicians/availability`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
        }

        const data = await response.json();
        revalidatePath("/technician-dashboard/availability");

        return {
            success: response.ok,
            message: data?.message || "Availability updated successfully",
            data: data?.data || data,
        };
    } catch (error: any) {
        console.error("Update availability error:", error);
        return { success: false, message: error?.message || "Failed to update availability" };
    }
}