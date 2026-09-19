import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value?.toUpperCase();
    const { pathname } = request.nextUrl;

    // 1. Unauthenticated users cannot access any dashboard
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Strict Role-based Protection
    if (pathname.startsWith("/admin-dashboard") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/technician-dashboard") && role !== "TECHNICIAN") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/customer-dashboard") && role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}


export { middleware as proxy };

export const config = {
    matcher: [
        "/admin-dashboard/:path*",
        "/technician-dashboard/:path*",
        "/customer-dashboard/:path*",
    ],
};