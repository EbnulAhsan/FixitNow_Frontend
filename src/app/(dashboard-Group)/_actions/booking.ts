/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const isUUID = (id?: string) =>
    Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

// Public and Server Action which is Fetch for all services
export async function getAllServicesAction() {
    try {
        
        const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
        const base = (envUrl && envUrl.trim() !== "")
            ? envUrl.replace(/\/+$/, "")
            : "https://fixitnow-backend-rkod.onrender.com/api";

        const endpoint = base.endsWith("/services")
            ? base
            : base.endsWith("/api")
                ? `${base}/services`
                : `${base}/api/services`;

        console.log("Fetching services from:", endpoint);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Backend responded with status:", response.status);
            return { success: false, data: [] };
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        return { success: true, data: list };
    } catch (error) {
        console.error("Fetch all services error:", error);
        return { success: false, data: [] };
    }
}

// Fetch single technician profile data form the schema and database 
export async function getTechnicianByIdAction(technicianId: string) {
    try {
        let res = await fetch(`${BACKEND_URL}/api/technicians/${technicianId}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            res = await fetch(`${BACKEND_URL}/api/users/${technicianId}`, {
                method: "GET",
                cache: "no-store",
            });
        }

        const data = await res.json();
        return { success: res.ok, data: data?.data || data };
    } catch (error) {
        console.error("Fetch technician profile error:", error);
        return { success: false, data: null };
    }
}

// get customer dashboard booking list 
export async function getCustomerBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "No token found", data: [] };
        }

        let response = await fetch(`${BACKEND_URL}/api/bookings/my-bookings`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            response = await fetch(`${BACKEND_URL}/api/bookings`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });
        }

        const data = await response.json();
        let bookingList = [];
        if (Array.isArray(data)) {
            bookingList = data;
        } else if (Array.isArray(data?.data)) {
            bookingList = data.data;
        } else if (Array.isArray(data?.data?.data)) {
            bookingList = data.data.data;
        } else if (Array.isArray(data?.data?.result)) {
            bookingList = data.data.result;
        } else if (Array.isArray(data?.result)) {
            bookingList = data.result;
        }

        return { success: true, data: bookingList };
    } catch (error) {
        console.error("Fetch booking server error:", error);
        return { success: false, data: [] };
    }
}

// Booking create action for technician profile and services as well 
export async function createBookingAction(payload: {
    serviceId?: string;
    technicianId?: string;
    technicianName?: string;
    bookingDate?: string;
    date?: string;
    timeSlot?: string;
    address?: string;
    notes?: string;
}) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Please log in to book a service." };
        }

        const rawDate = payload.bookingDate || payload.date;
        let formattedBookingDate: string;

        if (rawDate && rawDate.includes("T")) {
            formattedBookingDate = rawDate;
        } else if (rawDate) {
            formattedBookingDate = new Date(`${rawDate}T10:00:00.000Z`).toISOString();
        } else {
            formattedBookingDate = new Date().toISOString();
        }

        const backendPayload: Record<string, any> = {
            bookingDate: formattedBookingDate,
        };

        if (payload.serviceId && isUUID(payload.serviceId)) {
            backendPayload.serviceId = payload.serviceId;
        }
        if (payload.technicianId && isUUID(payload.technicianId)) {
            backendPayload.technicianId = payload.technicianId;
        }
        if (payload.timeSlot) {
            backendPayload.timeSlot = payload.timeSlot;
        }
        if (payload.address) {
            backendPayload.address = payload.address;
        }
        if (payload.notes) {
            backendPayload.notes = payload.notes;
        }

        const response = await fetch(`${BACKEND_URL}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(backendPayload),
        });

        const data = await response.json();
        if (!response.ok) {
            return { success: false, message: data.message || "Failed to create booking" };
        }

        revalidatePath("/customer-dashboard");
        revalidatePath("/customer-dashboard/bookings");

        return { success: true, message: "Booking placed successfully!", data: data.data || data };
    } catch (error) {
        console.error("Create booking error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

// Booking cancel action
export async function cancelBookingAction(bookingId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }

        let response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}/cancel`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "CANCELLED" }),
            });
        }

        const data = await response.json();
        if (!response.ok) {
            return { success: false, message: data.message || "Failed to cancel booking" };
        }

        revalidatePath("/customer-dashboard");
        return { success: true, data };
    } catch (error) {
        console.error("Cancel action error:", error);
        return { success: false, message: "Server connection failed" };
    }
}