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
    Hammer,
    Clock,
    CheckCircle2,
    Sparkles
} from "lucide-react";

export default function HomePage() {
    const [mounted, setMounted] = useState(false);

   
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-zinc-950 flex items-center">

            {/* 🌟 New Fresh Color Animated Background Orbs (Cyan, Emerald, Blue) 🌟 */}
            <div className="absolute top-[-10%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-blue-600/20 blur-[120px] duration-10000" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-emerald-500/20 blur-[120px] duration-10000" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[30%] left-[40%] h-[30rem] w-[30rem] animate-pulse rounded-full bg-cyan-500/20 blur-[120px] duration-10000" style={{ animationDelay: '4s' }} />

            {/* Grid Pattern Overlay for extra tech-vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 py-12 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content Section - Slide Right Animation */}
                    <div className={`space-y-8 transition-all duration-1000 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <Sparkles className="h-4 w-4 text-cyan-400" /> Premium Home Services Platform
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                            Expert Services, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 drop-shadow-sm">
                                Delivered Faster.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-300 max-w-xl leading-relaxed">
                            Book verified top-tier professionals for AC repair, plumbing, electrical, and cleaning services. Transparent pricing, instant booking.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/services">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg shadow-cyan-500/25 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 hover:scale-[1.03] transition-transform duration-300 gap-2">
                                    Explore Services <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/technicians">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-colors gap-2">
                                    Find Technicians
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
                            <div className="space-y-2">
                                <h4 className="text-3xl font-bold text-white">4.9/5</h4>
                                <div className="flex text-amber-400"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
                                <p className="text-xs text-zinc-400">Customer Reviews</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-3xl font-bold text-white">5k+</h4>
                                <p className="text-sm font-medium text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Verified</p>
                                <p className="text-xs text-zinc-400">Active Technicians</p>
                            </div>
                            <div className="space-y-2 hidden sm:block">
                                <h4 className="text-3xl font-bold text-white">24/7</h4>
                                <p className="text-sm font-medium text-cyan-400 flex items-center gap-1"><Clock className="h-4 w-4" /> Support</p>
                                <p className="text-xs text-zinc-400">Always available</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Floating Cards Section - Fade Up Animation */}
                    <div className={`relative h-[500px] w-full hidden lg:block transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

                        {/* Center Main Card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-20 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-3xl pointer-events-none" />
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                                <ShieldCheck className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">100% Secure</h3>
                            <p className="text-sm text-zinc-400">All our technicians are background verified.</p>
                        </div>

                        {/* Floating Card 1 (Top Right) */}
                        <div className="absolute top-10 right-0 w-48 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl z-10 animate-[bounce_5s_ease-in-out_infinite]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <Droplet className="h-5 w-5" />
                                </div>
                                <h4 className="font-semibold text-white text-sm">Plumbing</h4>
                            </div>
                            <p className="text-xs text-zinc-400">Leakages & pipelines</p>
                        </div>

                        {/* Floating Card 2 (Bottom Left) */}
                        <div className="absolute bottom-12 left-0 w-48 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl z-10 animate-[bounce_6s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <h4 className="font-semibold text-white text-sm">Electrical</h4>
                            </div>
                            <p className="text-xs text-zinc-400">Wiring & appliances</p>
                        </div>

                        {/* Floating Card 3 (Bottom Right) */}
                        <div className="absolute bottom-32 right-[-20px] w-48 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl z-30 animate-[bounce_4s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                    <Hammer className="h-5 w-5" />
                                </div>
                                <h4 className="font-semibold text-white text-sm">Carpentry</h4>
                            </div>
                            <p className="text-xs text-zinc-400">Furniture & repairs</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}