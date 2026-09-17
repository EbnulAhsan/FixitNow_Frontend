"use server";

import { cookies } from "next/headers";

export async function createPaymentIntentAction(bookingId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized. Please login." };
        }

        const response = await fetch("http://localhost:5000/api/payments/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bookingId }),
        });

        const resData = await response.json();
        console.log("Create PaymentIntent response:", resData);

        if (!response.ok) {
            return {
                success: false,
                message: resData.message || "Failed to create payment intent",
            };
        }

        const clientSecret =
            resData.clientSecret ||
            resData.data?.clientSecret ||
            resData.data?.client_secret;

        return {
            success: true,
            clientSecret,
            data: resData.data || resData,
        };
    } catch (error) {
        console.error("Payment intent error:", error);
        return { success: false, message: "Server connection failed" };
    }
}