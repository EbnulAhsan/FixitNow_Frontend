"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { logoutUser } from "../../service/logout";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        // কুকি থেকে Auth স্টেট চেক
        setToken(getCookie("token") as string | null);
        setRole(getCookie("role") as string | null);
    }, []);

    const getDashboardLink = () => {
        if (role === "ADMIN") return "/admin-dashboard";
        if (role === "TECHNICIAN") return "/technician-dashboard";
        return "/customer-dashboard";
    };

    return (
        // এখানে পার্মানেন্ট ডার্ক ব্যাকগ্রাউন্ড দেওয়া হয়েছে যাতে আর কখনো সাদা না দেখায়
        <nav className="fixed top-0 w-full z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* 🌟 Animated Logo matching Hero Section (Cyan/Blue) 🌟 */}
                    <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 w-max group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                            <Wrench className="h-5 w-5 animate-bounce group-hover:animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            FixIt<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Now</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/services" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors relative group">
                            Services
                            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/technicians" className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors relative group">
                            Technicians
                            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {token ? (
                            <>
                                <Link href={getDashboardLink()}>
                                    <Button variant="outline" className="border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 backdrop-blur-sm gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button onClick={logoutUser} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10 font-medium">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform duration-300 font-semibold px-6">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-300 hover:text-white transition-colors">
                            {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2">
                    <Link href="/" className="block px-4 py-3 text-zinc-300 hover:bg-white/5 hover:text-cyan-400 rounded-xl transition-colors font-medium">Home</Link>
                    <Link href="/services" className="block px-4 py-3 text-zinc-300 hover:bg-white/5 hover:text-cyan-400 rounded-xl transition-colors font-medium">Services</Link>
                    <Link href="/technicians" className="block px-4 py-3 text-zinc-300 hover:bg-white/5 hover:text-cyan-400 rounded-xl transition-colors font-medium">Technicians</Link>

                    <div className="border-t border-white/10 pt-4 flex flex-col gap-3 pb-2">
                        {token ? (
                            <>
                                <Link href={getDashboardLink()}>
                                    <Button className="w-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button onClick={logoutUser} variant="ghost" className="w-full text-red-400 hover:bg-red-400/10 hover:text-red-300 justify-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="w-full text-zinc-300 hover:bg-white/10 hover:text-white">Log in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25">Sign up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}