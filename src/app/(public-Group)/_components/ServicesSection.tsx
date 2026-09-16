"use client";

import Link from "next/link";
import { ArrowRight, Droplet, Zap, Wrench, ThermometerSnowflake, Paintbrush, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
    {
        id: 1,
        title: "AC Repair & Servicing",
        description: "Expert AC cooling solutions, cleaning, and maintenance.",
        icon: ThermometerSnowflake,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "group-hover:border-cyan-500/50",
    },
    {
        id: 2,
        title: "Electrical Works",
        description: "Wiring, circuit fixing, and appliance installations.",
        icon: Zap,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "group-hover:border-blue-500/50",
    },
    {
        id: 3,
        title: "Plumbing Solutions",
        description: "Pipe leakages, blockages, and sanitary fittings.",
        icon: Droplet,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "group-hover:border-emerald-500/50",
    },
    {
        id: 4,
        title: "Carpentry Services",
        description: "Furniture repair, assembly, and custom woodwork.",
        icon: Wrench,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "group-hover:border-amber-500/50",
    },
    {
        id: 5,
        title: "Home Painting",
        description: "Interior and exterior painting with premium finish.",
        icon: Paintbrush,
        color: "text-fuchsia-400",
        bgColor: "bg-fuchsia-500/10",
        borderColor: "group-hover:border-fuchsia-500/50",
    },
    {
        id: 6,
        title: "Pest Control",
        description: "Complete eradication of insects and rodents safely.",
        icon: ShieldAlert,
        color: "text-rose-400",
        bgColor: "bg-rose-500/10",
        borderColor: "group-hover:border-rose-500/50",
    },
];

export default function ServicesSection() {
    return (
        <section className="py-28 relative z-10 bg-zinc-950 overflow-hidden">

            {/* 🌟 Hero Section এর সাথে ম্যাচিং ব্যাকগ্রাউন্ড গ্লোয়িং অর্বস ও গ্রিড প্যাটার্ন 🌟 */}
            <div className="absolute top-[20%] right-[-10%] h-[35rem] w-[35rem] animate-pulse rounded-full bg-cyan-500/10 blur-[130px] duration-10000 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-blue-600/15 blur-[140px] duration-10000 pointer-events-none" style={{ animationDelay: '3s' }} />

            {/* Tech Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl space-y-4">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                            Our Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">Services</span>
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Choose from our wide range of professional home services. Highly trained technicians at your doorstep.
                        </p>
                    </div>
                    <Link href="/services">
                        <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-md gap-2 h-12 px-6">
                            View All Services <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Services Grid with Enhanced Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={service.id}
                                className={`group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-cyan-500/40 ${service.borderColor}`}
                            >
                                {/* Card Inner Glow Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                                <div className="relative z-10">
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-lg ${service.bgColor}`}>
                                        <Icon className={`h-8 w-8 ${service.color}`} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-zinc-400 text-base leading-relaxed mb-8">
                                        {service.description}
                                    </p>

                                    <Link href={`/services/${service.id}`} className="inline-flex items-center text-sm font-semibold text-cyan-400 hover:text-cyan-300 gap-2 group/link">
                                        Book Now <ArrowRight className="h-4 w-4 transform transition-transform group-hover/link:translate-x-1.5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}