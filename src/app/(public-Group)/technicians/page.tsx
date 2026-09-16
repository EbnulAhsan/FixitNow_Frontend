"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, ShieldCheck, MapPin, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ডেমো টেকনিশিয়ান ডেটা লিস্ট
const allTechnicians = [
    {
        id: 1,
        name: "Rahim Ahmed",
        specialty: "AC & Cooling Expert",
        category: "Cooling & Heating",
        rating: 4.9,
        reviews: 124,
        experience: "6 Years",
        location: "Mirpur, Dhaka",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        verified: true,
    },
    {
        id: 2,
        name: "Tanvir Hossain",
        specialty: "Master Electrician",
        category: "Electrical",
        rating: 4.8,
        reviews: 98,
        experience: "8 Years",
        location: "Gulshan, Dhaka",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        verified: true,
    },
    {
        id: 3,
        name: "Kamal Uddin",
        specialty: "Plumbing & Sanitary Specialist",
        category: "Plumbing",
        rating: 4.9,
        reviews: 156,
        experience: "10 Years",
        location: "Dhanmondi, Dhaka",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        verified: true,
    },
    {
        id: 4,
        name: "Sharif Sarkar",
        specialty: "Woodwork & Furniture Carpenter",
        category: "Woodwork",
        rating: 4.7,
        reviews: 75,
        experience: "5 Years",
        location: "Uttara, Dhaka",
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
        verified: true,
    },
    {
        id: 5,
        name: "Nazrul Islam",
        specialty: "Professional Home Painter",
        category: "Painting & Renovation",
        rating: 4.8,
        reviews: 88,
        experience: "7 Years",
        location: "Banani, Dhaka",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
        verified: true,
    },
    {
        id: 6,
        name: "Jashim Uddin",
        specialty: "Pest Control & Safety Expert",
        category: "Cleaning & Safety",
        rating: 4.9,
        reviews: 110,
        experience: "6 Years",
        location: "Mohammadpur, Dhaka",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
        verified: true,
    },
];

export default function TechniciansPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Cooling & Heating", "Electrical", "Plumbing", "Woodwork", "Painting & Renovation", "Cleaning & Safety"];

    // ফিল্টার লজিক
    const filteredTechnicians = allTechnicians.filter((tech) => {
        const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || tech.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white pb-24">

            {/* Background Glow Orbs */}
            <div className="absolute top-[10%] right-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-emerald-500/15 blur-[140px] pointer-events-none" />
            <div className="absolute top-[60%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 pt-16">

                {/* Page Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 backdrop-blur-md">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Background Verified Experts
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Meet Our Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">Technicians</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Connect with skilled, licensed, and trusted professionals ready to handle your home repairs.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto pt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 mt-2" />
                        <Input
                            type="text"
                            placeholder="Search by name, specialty, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 pl-12 bg-zinc-900/60 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl backdrop-blur-xl focus-visible:ring-emerald-500"
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-2 pt-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                                    ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 scale-105"
                                    : "bg-zinc-900/60 border border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Technicians Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTechnicians.length > 0 ? (
                        filteredTechnicians.map((tech) => (
                            <div
                                key={tech.id}
                                className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-emerald-500/40 flex flex-col justify-between"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                                <div className="relative z-10">
                                    {/* Top Profile Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative">
                                            <img
                                                src={tech.image}
                                                alt={tech.name}
                                                className="h-16 w-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors"
                                            />
                                            {tech.verified && (
                                                <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs shadow">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-emerald-300 transition-colors">{tech.name}</h3>
                                            <p className="text-xs font-semibold text-emerald-400">{tech.specialty}</p>
                                        </div>
                                    </div>

                                    {/* Details Badge */}
                                    <div className="space-y-2.5 mb-8 text-sm text-zinc-300">
                                        <div className="flex items-center justify-between bg-zinc-800/40 px-4 py-2 rounded-xl border border-white/5">
                                            <span className="flex items-center gap-2 text-zinc-400"><Award className="h-4 w-4 text-cyan-400" /> Experience</span>
                                            <span className="font-semibold text-white">{tech.experience}</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-zinc-800/40 px-4 py-2 rounded-xl border border-white/5">
                                            <span className="flex items-center gap-2 text-zinc-400"><MapPin className="h-4 w-4 text-rose-400" /> Location</span>
                                            <span className="font-semibold text-white">{tech.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-zinc-800/40 px-4 py-2 rounded-xl border border-white/5">
                                            <span className="flex items-center gap-2 text-zinc-400"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Rating</span>
                                            <span className="font-semibold text-white">{tech.rating} <span className="text-xs text-zinc-500">({tech.reviews} reviews)</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 pt-4 border-t border-white/10">
                                    <Link href={`/technicians/${tech.id}`}>
                                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white rounded-xl gap-2 shadow-md shadow-emerald-500/20 font-semibold">
                                            View Profile & Book <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-zinc-500">
                            <p className="text-xl">No technicians found matching your search.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}