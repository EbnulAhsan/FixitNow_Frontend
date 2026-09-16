import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;
    const { pathname } = request.nextUrl;

    // ড্যাশবোর্ড রাউট প্রটেকশন
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

export const config = {
    matcher: ["/admin-dashboard/:path*", "/technician-dashboard/:path*", "/customer-dashboard/:path*"],
};