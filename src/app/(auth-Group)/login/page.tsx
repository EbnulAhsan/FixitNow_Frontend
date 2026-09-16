"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    Wrench,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Sparkles
} from "lucide-react";
import { loginAction } from "../_actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // পেজ লোড হওয়ার পর অ্যানিমেশন ট্রিগার করার জন্য
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginAction(formData);

            if (res.success && res.user) {
                toast.success(`Welcome back, ${res.user.name || "User"}!`);

                if (res.user.role === "ADMIN") {
                    router.push("/admin-dashboard");
                } else if (res.user.role === "TECHNICIAN") {
                    router.push("/technician-dashboard");
                } else {
                    router.push("/customer-dashboard");
                }
                router.refresh();
            } else {
                toast.error(res.message || "Failed to login");
            }
        } catch (err) {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full overflow-hidden bg-zinc-950">
            {/* 🌟 Colorful Animated Background Orbs 🌟 */}
            <div className="absolute top-[-10%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-indigo-600/30 blur-[120px] duration-10000" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-fuchsia-600/30 blur-[120px] duration-10000" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[10%] h-[25rem] w-[25rem] animate-pulse rounded-full bg-cyan-500/20 blur-[100px] duration-10000" style={{ animationDelay: '4s' }} />

            {/* Left Branding Showcase - With Slide In Animation */}
            <div className={`hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative z-10 transition-all duration-1000 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 text-3xl font-bold tracking-tight hover:scale-105 transition-transform duration-300 w-max">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                            <Wrench className="h-6 w-6 animate-bounce" style={{ animationDuration: '3s' }} />
                        </div>
                        FixIt<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Now</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-200 backdrop-blur-md shadow-lg">
                        <Sparkles className="h-4 w-4 text-cyan-400" /> Welcome back to your dashboard
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]">
                        Manage your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">Services & Bookings.</span>
                    </h1>
                    <p className="text-zinc-300 text-lg max-w-md leading-relaxed">
                        Seamless service bookings, real-time availability scheduling, and transparent payment tracking in one unified platform.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10 text-base text-zinc-300">
                        <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors">
                                <ShieldCheck className="h-6 w-6 text-indigo-400" />
                            </div>
                            Role Protected
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-lg bg-fuchsia-500/20 group-hover:bg-fuchsia-500/40 transition-colors">
                                <CheckCircle2 className="h-6 w-6 text-fuchsia-400" />
                            </div>
                            Instant Updates
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-zinc-500">
                    © FixItNow Platform. All rights reserved.
                </div>
            </div>

            {/* Right Form Container - Glassmorphism & Fade Up Animation */}
            <div className={`flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 relative z-10 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">

                    {/* subtle inner gradient for card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

                    <div className="space-y-2 text-center lg:text-left relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-zinc-400">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@domain.com"
                                    required
                                    className="h-12 bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                                </div>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="h-12 bg-black/50 border-white/10 text-white pr-10 placeholder:text-zinc-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold shadow-lg gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white border-0 hover:scale-[1.02] transition-transform duration-300"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : (
                                <>
                                    Sign In
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-400 relative z-10">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-fuchsia-400 hover:text-fuchsia-300 hover:underline transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}