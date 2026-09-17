"use server";

import { cookies } from "next/headers";

export async function createPaymentIntentAction(bookingId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized. Please login to proceed with payment." };
        }

        const response = await fetch("http://localhost:5000/api/payments/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bookingId }),
            cache: "no-store",
        });

        const resData = await response.json();
        console.log("Backend PaymentIntent response:", resData);

        if (!response.ok) {
            return {
                success: false,
                message: resData.message || resData.error || "Failed to create payment intent",
            };
        }

        
        const clientSecret =
            resData.clientSecret ||
            resData.client_secret ||
            resData.data?.clientSecret ||
            resData.data?.client_secret;

        if (!clientSecret) {
            return {
                success: false,
                message: "No client secret returned from payment gateway",
            };
        }

        return {
            success: true,
            clientSecret,
            data: resData.data || resData,
        };
    } catch (error) {
        console.error("Payment intent action error:", error);
        return { success: false, message: "Server connection failed" };
    }
}