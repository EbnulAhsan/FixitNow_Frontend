/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";


// login 
export async function loginAction(formData: { email: string; password: string }) {
    try {

        const BACKEND_URL = "http://localhost:5000/api/auth/login";

        console.log("Hitting Backend URL:", BACKEND_URL);

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Invalid email or password",
            };
        }

        const accessToken = data.data?.accessToken || data.token;

        if (!accessToken) {
            return { success: false, message: "Token not received from server" };
        }


        let role = "CUSTOMER";
        try {
            const base64Url = accessToken.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const decodedToken = JSON.parse(jsonPayload);
            if (decodedToken.role) {
                role = decodedToken.role;
            }
        } catch (e) {
            console.error("Token decode error", e);
        }

        return {
            success: true,
            accessToken,
            role,
        };
    } catch (error) {
        return {
            success: false,
            message: "Server connection failed. Is the backend running?",
        };
    }
}


// registration

// --- REGISTER ACTION (নতুন) ---
export async function registerAction(formData: any) {
    try {
        // আপনার ব্যাকএন্ডের রেজিস্ট্রেশন এন্ডপয়েন্ট (পোর্ট 5000 ধরে নিচ্ছি)
        const BACKEND_URL = "http://localhost:5000/api/auth/register";

        console.log("Hitting Backend URL:", BACKEND_URL);

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Registration failed" };
        }

        // সাধারণত রেজিস্ট্রেশনের পরও ব্যাকএন্ড টোকেন রিটার্ন করে, যদি করে সেটা ধরব
        const accessToken = data.data?.accessToken || data.token;

        return {
            success: true,
            message: data.message || "Registration successful!",
            accessToken: accessToken
        };
    } catch (error) {
        return { success: false, message: "Server connection failed. Is the backend running?" };
    }
}