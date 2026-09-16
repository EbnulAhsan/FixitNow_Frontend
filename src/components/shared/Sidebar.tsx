"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    CalendarCheck,
    Clock,
    CreditCard,
    LogOut,
    Wrench
} from "lucide-react";

export default function Sidebar({ role }: { role: string }) {
    const pathname = usePathname();


    const getLinks = () => {
        if (role === "ADMIN") {
            return [
                { name: "Admin Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
                { name: "Manage Users", href: "/admin-dashboard/users", icon: Users },
                { name: "Categories", href: "/admin-dashboard/categories", icon: Settings },
            ];
        } else if (role === "TECHNICIAN") {
            return [
                { name: "Tech Dashboard", href: "/technician-dashboard", icon: LayoutDashboard },
                { name: "My Bookings", href: "/technician-dashboard/bookings", icon: CalendarCheck },
                { name: "Availability", href: "/technician-dashboard/availability", icon: Clock },
            ];
        } else {
            return [
                { name: "My Dashboard", href: "/customer-dashboard", icon: LayoutDashboard },
                { name: "My Bookings", href: "/customer-dashboard/bookings", icon: CalendarCheck },
                { name: "Payment History", href: "/customer-dashboard/payments", icon: CreditCard },
            ];
        }
    };

    const links = getLinks();

    const handleLogout = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure";
        document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure";
        window.location.replace("/login");
    };

    return (
        <div className="flex h-screen w-64 flex-col justify-between border-r border-white/10 bg-zinc-950 p-6 text-white">
            <div>
                {/* Logo */}
                <Link href="/" className="mb-10 flex items-center gap-3 text-2xl font-bold tracking-tight">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <Wrench className="h-4 w-4" />
                    </div>
                    FixIt<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Now</span>
                </Link>

                {/* Navigation Links */}
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${isActive
                                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Logout Button */}
            <div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}