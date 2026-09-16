"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, ThermometerSnowflake, Zap, Droplet, Wrench, Paintbrush, ShieldAlert, Star, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ফুল সার্ভিস ডেটা লিস্ট
const allServices = [
    {
        id: 1,
        title: "AC Repair & Servicing",
        category: "Cooling & Heating",
        description: "Expert AC cooling solutions, deep cleaning, gas refilling, and general maintenance.",
        price: "$49 - $120",
        rating: 4.9,
        icon: ThermometerSnowflake,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
    },
    {
        id: 2,
        title: "Electrical Works",
        category: "Electrical",
        description: "Wiring, circuit fixing, light installations, and home appliance repairs by licensed electricians.",
        price: "$35 - $90",
        rating: 4.8,
        icon: Zap,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
    },
    {
        id: 3,
        title: "Plumbing Solutions",
        category: "Plumbing",
        description: "Pipe leakages, drain blockages, faucet repairs, and complete sanitary fittings.",
        price: "$40 - $100",
        rating: 4.9,
        icon: Droplet,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
    },
    {
        id: 4,
        title: "Carpentry Services",
        category: "Woodwork",
        description: "Custom furniture repair, door lock installation, assembly, and custom woodwork.",
        price: "$45 - $150",
        rating: 4.7,
        icon: Wrench,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
    },
    {
        id: 5,
        title: "Home Painting",
        category: "Painting & Renovation",
        description: "Interior and exterior wall painting with high-end premium finish and texture work.",
        price: "$100 - $500",
        rating: 4.9,
        icon: Paintbrush,
        color: "text-fuchsia-400",
        bgColor: "bg-fuchsia-500/10",
    },
    {
        id: 6,
        title: "Pest Control",
        category: "Cleaning & Safety",
        description: "Complete and safe eradication of insects, termites, and rodents from your living spaces.",
        price: "$60 - $130",
        rating: 4.8,
        icon: ShieldAlert,
        color: "text-rose-400",
        bgColor: "bg-rose-500/10",
    },
];

export default function ServicesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // ক্যাটাগরি লিস্ট
    const categories = ["All", "Cooling & Heating", "Electrical", "Plumbing", "Woodwork", "Painting & Renovation", "Cleaning & Safety"];

    // ফিল্টারিং লজিক
    const filteredServices = allServices.filter((service) => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white pb-24">

            {/* 🌟 Background Glow Orbs */}
            <div className="absolute top-[10%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
            <div className="absolute top-[50%] right-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 pt-16">

                {/* Page Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 backdrop-blur-md">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Verified Professional Services
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Explore All Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">Services</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Find the right expert for your home maintenance needs with upfront pricing and guaranteed quality.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto pt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 mt-2" />
                        <Input
                            type="text"
                            placeholder="Search for AC repair, plumbing, electrical..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 pl-12 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl backdrop-blur-xl focus-visible:ring-cyan-500"
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-2 pt-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105"
                                    : "bg-zinc-900/60 border border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={service.id}
                                    className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-cyan-500/40 flex flex-col justify-between"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${service.bgColor}`}>
                                                <Icon className={`h-8 w-8 ${service.color}`} />
                                            </div>
                                            <div className="flex items-center gap-1 bg-zinc-800/80 px-3 py-1 rounded-full border border-white/5 text-xs font-semibold text-amber-400">
                                                <Star className="h-3.5 w-3.5 fill-current" /> {service.rating}
                                            </div>
                                        </div>

                                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{service.category}</span>
                                        <h3 className="text-2xl font-bold mt-1 mb-3 group-hover:text-cyan-300 transition-colors">
                                            {service.title}
                                        </h3>

                                        <p className="text-zinc-400 text-base leading-relaxed mb-6">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="text-xs text-zinc-500 block">Estimated Price</span>
                                            <span className="text-lg font-bold text-white">{service.price}</span>
                                        </div>

                                        <Link href={`/services/${service.id}`}>
                                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl gap-2 shadow-md shadow-cyan-500/20">
                                                Book Now <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-20 text-zinc-500">
                            <p className="text-xl">No services found matching your search.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}