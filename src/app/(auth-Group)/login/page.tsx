/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { Wrench, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { loginAction } from "../_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const parseRoleFromToken = (token: string): string => {
        try {
            const base64Url = token.split(".")[1];
            if (!base64Url) return "CUSTOMER";
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const decoded = JSON.parse(jsonPayload);
            return (decoded.role || decoded.user?.role || "CUSTOMER").toUpperCase();
        } catch (e) {
            console.error("JWT Decode error:", e);
            return "CUSTOMER";
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginAction(formData);
            console.log("Login Response:", res);

            if (res.success && (res.accessToken || (res as any).token)) {
                const token = res.accessToken || (res as any).token;

                // Determine accurate role 
                let resolvedRole = res.role || (res as any).user?.role;
                if (!resolvedRole || resolvedRole === "CUSTOMER") {
                    resolvedRole = parseRoleFromToken(token);
                }
                resolvedRole = resolvedRole.toUpperCase();

                // LocalStorage backup for persistent client state
                localStorage.setItem("token", token);
                localStorage.setItem("user_role", resolvedRole);

                // Set cookies without strict secure flag on localhost so HTTP accepts it
                const isProd = window.location.protocol === "https:";
                const secureFlag = isProd ? "; Secure" : "";
                document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax${secureFlag}`;
                document.cookie = `role=${resolvedRole}; path=/; max-age=604800; SameSite=Lax${secureFlag}`;

                // Instant Role-based redirection
                if (resolvedRole === "ADMIN") {
                    window.location.href = "/admin-dashboard";
                } else if (resolvedRole === "TECHNICIAN") {
                    window.location.href = "/technician-dashboard";
                } else {
                    window.location.href = "/customer-dashboard";
                }
            } else {
                alert(res.message || "Invalid email or password");
                setLoading(false);
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert("Something went wrong! Please check your connection.");
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full overflow-hidden bg-zinc-950">
            <div className="absolute top-[-10%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-indigo-600/30 blur-[120px] duration-10000" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-fuchsia-600/30 blur-[120px] duration-10000" style={{ animationDelay: '2s' }} />

            <div className={`hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative z-10 transition-all duration-1000 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <Wrench className="h-6 w-6" />
                        </div>
                        FixIt<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Now</span>
                    </Link>
                </div>
                <div className="relative z-10 space-y-8">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]">
                        Manage your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">Services & Bookings.</span>
                    </h1>
                </div>
                <div className="relative z-10 text-sm text-zinc-500">© FixItNow Platform. All rights reserved by Ebnul Ahsan</div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-2xl relative overflow-hidden">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
                        <p className="text-sm text-zinc-400">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@domain.com"
                                    required
                                    className="h-12 bg-black/50 border-white/10 text-white"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="h-12 bg-black/50 border-white/10 text-white pr-10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                                </span>
                            ) : (
                                <>Sign In <ArrowRight className="h-4 w-4" /></>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}