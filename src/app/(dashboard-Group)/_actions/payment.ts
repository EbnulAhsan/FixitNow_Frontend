/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// 1. Payment Intent create kora (Stripe clientSecret ante)
export async function createPaymentIntentAction(bookingId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return {
                success: false,
                message: "Unauthorized. Please login to proceed with payment.",
            };
        }

        const response = await fetch(`${BACKEND_URL}/api/payments/create-payment-intent`, {
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
    } catch (error: any) {
        console.error("Payment intent action error:", error);
        return {
            success: false,
            message: error?.message || "Server connection failed",
        };
    }
}

// 2. Stripe payment confirm hole backend-e status update kora
export async function confirmBookingPaymentAction(bookingId: string, paymentIntentId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return {
                success: false,
                message: "Unauthorized request",
            };
        }

        const response = await fetch(`${BACKEND_URL}/api/payments/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bookingId, paymentIntentId }),
            cache: "no-store",
        });

        const resData = await response.json();
        console.log("Backend Confirm Payment Response:", resData);

        if (!response.ok) {
            return {
                success: false,
                message: resData.message || "Failed to confirm payment status",
            };
        }

        return {
            success: true,
            data: resData,
        };
    } catch (error: any) {
        console.error("Confirm payment action error:", error);
        return {
            success: false,
            message: error?.message || "Server connection failed",
        };
    }
}


// 3. customer dashboard payment history added 

export async function getCustomerPaymentsAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return {
                success: false,
                message: "Unauthorized request",
                data: [],
            };
        }

        const response = await fetch(`${BACKEND_URL}/api/payments/my-payments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const resData = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: resData.message || "Failed to fetch payment history",
                data: [],
            };
        }

        return {
            success: true,
            data: resData.data || [],
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Server connection error",
            data: [],
        };
    }
}