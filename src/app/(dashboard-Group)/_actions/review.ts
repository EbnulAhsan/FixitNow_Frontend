/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function submitReviewAction(payload: {
    bookingId: string;
    rating: number;
    comment: string;
}) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized request" };
        }

        const response = await fetch(`${BACKEND_URL}/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to submit review",
            };
        }

        revalidatePath("/customer-dashboard");
        return { success: true, data };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Internal server error",
        };
    }
}