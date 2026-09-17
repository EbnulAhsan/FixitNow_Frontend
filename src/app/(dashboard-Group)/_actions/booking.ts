/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

// Technician  Booking  by customer form the customer Dashboard 

export async function getCustomerBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "No token found", data: [] };
        }

        // ব্যাকএন্ডে my-bookings চেক করা হচ্ছে, না থাকলে ফলব্যাক হিসেবে /api/bookings
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
        console.log("Customer bookings backend response:", JSON.stringify(data, null, 2));

        let bookingList = [];
        if (Array.isArray(data)) {
            bookingList = data;
        } else if (Array.isArray(data.data)) {
            bookingList = data.data;
        } else if (data.data?.data && Array.isArray(data.data.data)) {
            bookingList = data.data.data;
        } else if (data.data?.result && Array.isArray(data.data.result)) {
            bookingList = data.data.result;
        }

        return {
            success: true,
            data: bookingList,
        };
    } catch (error) {
        console.error("Fetch booking server error:", error);
        return { success: false, data: [] };
    }
}

// create booking action for customer
export async function createBookingAction(payload: {
    serviceId?: string;
    technicianId?: string;
    date: string;
    timeSlot: string;
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
            serviceId: payload.serviceId || "bdc01934-3f9d-407f-8dea-b6725ec6b616",
            technicianId: "027a95d5-2eb0-4547-a642-0531ab6080d8",
            bookingDate: formattedBookingDate,
            timeSlot: payload.timeSlot,
            notes: payload.notes || "",
        };

        console.log("Sending verified payload to backend:", backendPayload);

        const response = await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(backendPayload),
        });

        const data = await response.json();
        console.log("Backend response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            let errorMsg = data.message || "Failed to create booking";
            if (Array.isArray(data.errorDetails)) {
                errorMsg = data.errorDetails.map((e: any) => e.message).join(", ");
            } else if (typeof data.errorDetails === "string") {
                errorMsg = data.errorDetails;
            }
            return { success: false, message: errorMsg };
        }

        return { success: true, data: data.data || data };
    } catch (error) {
        console.error("Create booking error:", error);
        return { success: false, message: "Server connection failed" };
    }
}

// customer can canel the booking


export async function cancelBookingAction(bookingId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }

        // ব্যাকএন্ডে ক্যানসেল রিকোয়েস্ট (PATCH /api/bookings/:id/cancel অথবা status update)
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


// টেকনিশিয়ানের সব বুকিং নিয়ে আসার অ্যাকশন
export async function getTechnicianBookingsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { success: false, data: [] };

        // ব্যাকএন্ডের টেকনিশিয়ান বুকিং এন্ডপয়েন্ট
        let response = await fetch("http://localhost:5000/api/bookings/technician-bookings", {
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
        if (Array.isArray(data)) bookingList = data;
        else if (Array.isArray(data.data)) bookingList = data.data;
        else if (data.data?.data && Array.isArray(data.data.data)) bookingList = data.data.data;

        return { success: true, data: bookingList };
    } catch (error) {
        console.error("Fetch technician bookings error:", error);
        return { success: false, data: [] };
    }
}

// টেকনিশিয়ান কর্তৃক স্ট্যাটাস আপডেট করার অ্যাকশন (Accept, Decline, In-Progress, Completed)
export async function updateBookingStatusAction(bookingId: string, status: string) {
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

        // অল্টারনেটিভ এন্ডপয়েন্ট যদি ব্যাকএন্ড নরমাল PATCH /:id এক্সপেক্ট করে
        if (!response.ok) {
            const fallbackResponse = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            const fallbackData = await fallbackResponse.json();
            return { success: fallbackResponse.ok, message: fallbackData.message || "Updated" };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Update status error:", error);
        return { success: false, message: "Failed to update status" };
    }
}