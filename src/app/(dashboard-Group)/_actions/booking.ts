/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const isUUID = (id?: string) =>
    Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

// Public/Server Action: Fetch all services (Avoids client-side CORS error)
export async function getAllServicesAction() {
    try {
        const response = await fetch("http://localhost:5000/api/services", {
            method: "GET",
            cache: "no-store",
        });

        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        return { success: response.ok, data: list };
    } catch (error) {
        console.error("Fetch all services error:", error);
        return { success: false, data: [] };
    }
}

// Customer dashboard-er booking list get kora
export async function getCustomerBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "No token found", data: [] };
        }

        let response = await fetch("http://localhost:5000/api/bookings/my-bookings", {
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

// Booking create korar action
export async function createBookingAction(payload: {
    serviceId: string;
    technicianId?: string;
    technicianName?: string;
    date: string;
    timeSlot?: string;
    notes?: string;
}) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Please login to book a service." };
        }

        const formattedBookingDate = new Date(`${payload.date}T10:00:00.000Z`).toISOString();

        const backendPayload = {
            serviceId: payload.serviceId,
            bookingDate: formattedBookingDate,
        };

        const response = await fetch("http://localhost:5000/api/bookings", {
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

        return { success: true, data: data.data || data };
    } catch (error) {
        console.error("Create booking error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

// Booking cancel korar action
export async function cancelBookingAction(bookingId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }

        let response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
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

        return { success: true, data };
    } catch (error) {
        console.error("Cancel action error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

