"use server";

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