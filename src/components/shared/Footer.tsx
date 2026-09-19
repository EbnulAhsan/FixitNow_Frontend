"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();


    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <footer className="relative w-full overflow-hidden bg-zinc-950 text-white">
            {/* Multi-tone Neon Moving Cyber Beam */}
            <div className="relative h-[2px] w-full overflow-hidden bg-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                <div className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[2px] animate-beam pointer-events-none" />
            </div>

            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-72 w-[45rem] animate-pulse rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-6 py-14 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div className="space-y-4 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                                <Wrench className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                FixIt<span className="text-cyan-400">Now</span>
                            </span>
                        </Link>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Your trusted on-demand home service platform. Connecting skilled, background-verified professionals with homeowners.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 w-fit px-3 py-1 rounded-full">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>100% Verified Experts</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
                            <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Browse Services</Link></li>
                            <li><Link href="/technicians" className="hover:text-cyan-400 transition-colors">Find Technicians</Link></li>
                            <li><Link href="/customer-dashboard" className="hover:text-cyan-400 transition-colors">My Bookings</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">For Experts</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/technician-dashboard" className="hover:text-cyan-400 transition-colors">Technician Dashboard</Link></li>
                            <li><Link href="/technician-dashboard/availability" className="hover:text-cyan-400 transition-colors">Availability Schedule</Link></li>
                            <li><Link href="/register" className="hover:text-cyan-400 transition-colors">Join as Pro</Link></li>
                            <li><Link href="/admin-dashboard" className="hover:text-cyan-400 transition-colors">Admin Portal</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Support</h4>
                        <ul className="space-y-2.5 text-xs text-zinc-400">
                            <li className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                <span>Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                <span>+880 1700-000000</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                <span>support@fixitnow.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <p>© 2026 FixItNow Inc. All rights reserved by Ebnu L Aahsan</p>
                    <p>Built with Next.js & Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
}