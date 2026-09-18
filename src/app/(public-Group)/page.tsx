/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Star,
    ShieldCheck,
    Zap,
    Droplet,
    Wrench,
    Hammer,
    Clock,
    CheckCircle2,
    Sparkles,
    ThermometerSnowflake,
    Paintbrush,
    ShieldAlert,
    Loader2,
} from "lucide-react";
import { getAllServicesAction } from "@/app/(dashboard-Group)/_actions/booking";

// Visual theme mapping based on category keywords
const getServiceVisualTheme = (categoryName: string = "") => {
    const cat = categoryName.toLowerCase();
    if (cat.includes("cool") || cat.includes("ac")) {
        return {
            icon: ThermometerSnowflake,
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/10",
            borderColor: "group-hover:border-cyan-500/50",
        };
    }
    if (cat.includes("elect")) {
        return {
            icon: Zap,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "group-hover:border-blue-500/50",
        };
    }
    if (cat.includes("plumb")) {
        return {
            icon: Droplet,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            borderColor: "group-hover:border-emerald-500/50",
        };
    }
    if (cat.includes("wood") || cat.includes("carpent")) {
        return {
            icon: Hammer,
            color: "text-amber-400",
            bgColor: "bg-amber-500/10",
            borderColor: "group-hover:border-amber-500/50",
        };
    }
    if (cat.includes("paint")) {
        return {
            icon: Paintbrush,
            color: "text-fuchsia-400",
            bgColor: "bg-fuchsia-500/10",
            borderColor: "group-hover:border-fuchsia-500/50",
        };
    }
    if (cat.includes("clean") || cat.includes("pest")) {
        return {
            icon: ShieldAlert,
            color: "text-rose-400",
            bgColor: "bg-rose-500/10",
            borderColor: "group-hover:border-rose-500/50",
        };
    }
    return {
        icon: Wrench,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "group-hover:border-cyan-500/50",
    };
};

export default function HomePage() {
    const [mounted, setMounted] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);

        async function loadDynamicServices() {
            setLoading(true);
            try {
                const res = await getAllServicesAction();
                if (res.success && Array.isArray(res.data)) {
                    setServices(res.data.slice(0, 6));
                }
            } catch (err) {
                console.error("Failed to load homepage services:", err);
            } finally {
                setLoading(false);
            }
        }

        loadDynamicServices();
    }, []);

    return (
        <div className="relative w-full overflow-hidden bg-zinc-950 text-white selection:bg-cyan-500/30">
            {/* Background Glow Orbs */}
            <div className="absolute top-[5%] left-[-10%] h-[45rem] w-[45rem] animate-pulse rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
            <div
                className="absolute top-[40%] right-[-10%] h-[45rem] w-[45rem] animate-pulse rounded-full bg-emerald-500/15 blur-[140px] pointer-events-none"
                style={{ animationDelay: "2s" }}
            />
            <div
                className="absolute bottom-[10%] left-[20%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none"
                style={{ animationDelay: "4s" }}
            />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* HERO SECTION */}
            <section className="relative min-h-[calc(100vh-80px)] w-full flex items-center pt-24 pb-16">
                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div
                            className={`space-y-8 transition-all duration-1000 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                                }`}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                <Sparkles className="h-4 w-4 text-cyan-400" /> Premium Home Services Platform
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                                Expert Services, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
                                    Delivered Faster.
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-zinc-300 max-w-xl leading-relaxed">
                                Book verified top-tier professionals for AC repair, plumbing, electrical, and cleaning
                                services. Transparent pricing, instant booking.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/services">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg shadow-cyan-500/25 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 hover:scale-[1.03] transition-transform duration-300 gap-2 rounded-xl"
                                    >
                                        Explore Services <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/technicians">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-colors gap-2 rounded-xl"
                                    >
                                        Find Technicians
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
                                <div className="space-y-2">
                                    <h4 className="text-3xl font-bold">4.9/5</h4>
                                    <div className="flex text-amber-400">
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                    </div>
                                    <p className="text-xs text-zinc-400">Customer Reviews</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-3xl font-bold">5k+</h4>
                                    <p className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4" /> Verified
                                    </p>
                                    <p className="text-xs text-zinc-400">Active Technicians</p>
                                </div>
                                <div className="space-y-2 hidden sm:block">
                                    <h4 className="text-3xl font-bold">24/7</h4>
                                    <p className="text-sm font-medium text-cyan-400 flex items-center gap-1">
                                        <Clock className="h-4 w-4" /> Support
                                    </p>
                                    <p className="text-xs text-zinc-400">Always available</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Floating Visual Showcase */}
                        <div
                            className={`relative h-[500px] w-full hidden lg:block transition-all duration-1000 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                                }`}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-20 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-3xl pointer-events-none" />
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                                    <ShieldCheck className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">100% Secure</h3>
                                <p className="text-sm text-zinc-400">All our technicians are background verified.</p>
                            </div>

                            <div className="absolute top-10 right-0 w-48 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl z-10 animate-[bounce_5s_ease-in-out_infinite]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                        <Droplet className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-semibold text-sm">Plumbing</h4>
                                </div>
                                <p className="text-xs text-zinc-400">Leakages & pipelines</p>
                            </div>

                            <div
                                className="absolute bottom-12 left-0 w-48 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl z-10 animate-[bounce_6s_ease-in-out_infinite]"
                                style={{ animationDelay: "1s" }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-semibold text-sm">Electrical</h4>
                                </div>
                                <p className="text-xs text-zinc-400">Wiring & appliances</p>
                            </div>

                            <div
                                className="absolute bottom-32 right-[-20px] w-48 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl z-30 animate-[bounce_4s_ease-in-out_infinite]"
                                style={{ animationDelay: "2s" }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                        <Hammer className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-semibold text-sm">Carpentry</h4>
                                </div>
                                <p className="text-xs text-zinc-400">Furniture & repairs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DYNAMIC SERVICES GRID SECTION */}
            <section className="relative z-10 py-24">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl space-y-4">
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                                Our Popular{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
                                    Services
                                </span>
                            </h2>
                            <p className="text-zinc-400 text-lg">
                                Choose from our wide range of professional home services. Highly trained technicians at
                                your doorstep.
                            </p>
                        </div>
                        <Link href="/services">
                            <Button
                                variant="outline"
                                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-md gap-2 h-12 px-6 rounded-xl"
                            >
                                View All Services <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Dynamic Grid */}
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
                            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                            <span className="text-sm">Loading available services...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => {
                                const categoryName = service.category?.name || service.category || "General";
                                const theme = getServiceVisualTheme(categoryName);
                                const Icon = theme.icon;

                                // Combined unique key guaranteed never to collide
                                const uniqueKey = `${service.id || service.serviceId || "service"}-${service.technicianId || ""}-${index}`;

                                // Fallback route priority for booking
                                const targetTechId =
                                    service.technicianId ||
                                    service.technician?.id ||
                                    service.userId ||
                                    service.id;

                                const price =
                                    service.price !== undefined
                                        ? `৳${service.price}`
                                        : service.fee !== undefined
                                            ? `৳${service.fee}`
                                            : "৳500";

                                return (
                                    <div
                                        key={uniqueKey}
                                        className={`group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-cyan-500/40 flex flex-col justify-between ${theme.borderColor}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <div
                                                    className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg ${theme.bgColor}`}
                                                >
                                                    <Icon className={`h-8 w-8 ${theme.color}`} />
                                                </div>
                                                <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-semibold uppercase tracking-wider">
                                                    {categoryName}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                                                {service.title || service.name}
                                            </h3>

                                            <p className="text-zinc-400 text-base leading-relaxed mb-8 line-clamp-2">
                                                {service.description ||
                                                    "Certified professional home maintenance and repair delivered right to your location."}
                                            </p>
                                        </div>

                                        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between mt-auto">
                                            <div>
                                                <span className="text-xs text-zinc-500 block">Starting From</span>
                                                <span className="text-lg font-bold text-white">{price}</span>
                                            </div>

                                            <Link
                                                href={`/technicians/${targetTechId}`}
                                                className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 gap-2 group/link"
                                            >
                                                Book Now{" "}
                                                <ArrowRight className="h-4 w-4 transform transition-transform group-hover/link:translate-x-1.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}