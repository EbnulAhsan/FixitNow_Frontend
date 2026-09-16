"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Wrench,
    CalendarCheck,
    Settings,
    LogOut,
    Home,
    Clock,
    CreditCard
} from "lucide-react";
import { logoutUser } from "@/service/logout";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();


    const isAdmin = pathname.startsWith("/admin");
    const isTechnician = pathname.startsWith("/technician");


    const getNavLinks = () => {
        if (isAdmin) {
            return [
                { name: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
                { name: "Manage Users", href: "/admin-dashboard/users", icon: Users },
                { name: "Categories", href: "/admin-dashboard/categories", icon: Settings },
            ];
        }
        if (isTechnician) {
            return [
                { name: "Overview", href: "/technician-dashboard", icon: LayoutDashboard },
                { name: "Incoming Bookings", href: "/technician-dashboard/bookings", icon: CalendarCheck },
                { name: "Availability", href: "/technician-dashboard/availability", icon: Clock },
            ];
        }
        return [
            { name: "Overview", href: "/customer-dashboard", icon: LayoutDashboard },
            { name: "My Bookings", href: "/customer-dashboard/bookings", icon: CalendarCheck },
            { name: "Payment History", href: "/customer-dashboard/payments", icon: CreditCard },
        ];
    };

    const navLinks = getNavLinks();

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl hidden md:flex flex-col justify-between p-6">
                <div className="space-y-8">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <Wrench className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            FixIt<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Now</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="space-y-1.5">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <Home className="h-4 w-4" /> Back to Home
                        </Link>

                        <div className="pt-2 pb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-4">
                                {isAdmin ? "Admin Menu" : isTechnician ? "Technician Menu" : "Customer Menu"}
                            </span>
                        </div>

                        {navLinks.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" /> {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="pt-6 border-t border-white/10">
                    <Button
                        onClick={logoutUser}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-3"
                    >
                        <LogOut className="h-4 w-4" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="h-20 border-b border-white/10 bg-zinc-900/30 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20">
                    <h1 className="text-xl font-bold capitalize">
                        {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            ● Active Session
                        </span>
                    </div>
                </header>

                <div className="p-8 flex-grow">
                    {children}
                </div>
            </main>
        </div>
    );
}