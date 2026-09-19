"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Star, ShieldCheck, MapPin, Award, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllServicesAction } from "@/app/(dashboard-Group)/_actions/booking";

interface ServiceResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    technicianId: string;
    category?: {
        id: string;
        name: string;
    };
    technician?: {
        id: string;
        userId: string;
        bio?: string;
        experience?: number;
        hourlyRate?: number;
        skills?: string[];
        user?: {
            id: string;
            name: string;
            email: string;
            phone?: string;
            address?: string;
            profilePhoto?: string;
        };
    };
}

interface TechnicianCardItem {
    id: string;
    name: string;
    specialty: string;
    categories: string[];
    rating: number;
    reviews: number;
    experience: string;
    location: string;
    image: string;
    verified: boolean;
}

export default function TechniciansPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [technicians, setTechnicians] = useState<TechnicianCardItem[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTechnicians() {
            setLoading(true);
            try {
                const res = await getAllServicesAction();
                const services: ServiceResponse[] = res.data || [];


                const techMap = new Map<string, TechnicianCardItem>();
                const categorySet = new Set<string>();

                services.forEach((service, index) => {
                    const tech = service.technician;
                    const user = tech?.user;
                    const techId = tech?.id || service.technicianId || service.id;
                    const catName = service.category?.name || "General Service";

                    if (catName) categorySet.add(catName);

                    if (techMap.has(techId)) {
                        const existing = techMap.get(techId)!;
                        if (!existing.categories.includes(catName)) {
                            existing.categories.push(catName);
                        }
                    } else {
                        techMap.set(techId, {
                            id: techId,
                            name: user?.name || `Technician #${index + 1}`,
                            specialty: service.title || "Home Repair Specialist",
                            categories: [catName],
                            rating: 4.9,
                            reviews: 40 + index * 5,
                            experience: tech?.experience ? `${tech.experience} Years` : "5+ Years",
                            location: user?.address || "Dhaka, Bangladesh",
                            image:
                                user?.profilePhoto && user.profilePhoto.startsWith("http")
                                    ? user.profilePhoto
                                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
                            verified: true,
                        });
                    }
                });

                const uniqueTechList = Array.from(techMap.values());
                setTechnicians(uniqueTechList);
                setCategories(["All", ...Array.from(categorySet)]);
            } catch (error) {
                console.error("Failed to load technicians:", error);
            } finally {
                setLoading(false);
            }
        }

        loadTechnicians();
    }, []);

    const filteredTechnicians = technicians.filter((tech) => {
        const matchesSearch =
            tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tech.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || tech.categories.includes(selectedCategory);

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white pb-24">
            <div className="absolute top-[10%] right-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-emerald-500/15 blur-[140px] pointer-events-none" />
            <div className="absolute top-[60%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 md:px-6 pt-16">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 backdrop-blur-md">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Background Verified Experts
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Meet Our Expert{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                            Technicians
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Connect with skilled, licensed, and trusted professionals ready to handle your home repairs.
                    </p>

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

                    <div className="flex flex-wrap justify-center gap-2 pt-6">
                        {categories.map((cat, catIdx) => (
                            <button
                                key={`category-filter-${cat}-${catIdx}`}
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

                {loading ? (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={`skeleton-${n}`}
                                className="rounded-3xl border border-white/5 bg-zinc-900/30 p-8 space-y-6 animate-pulse"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-zinc-800" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-5 w-3/4 bg-zinc-800 rounded-lg" />
                                        <div className="h-3 w-1/2 bg-zinc-800/60 rounded-lg" />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="h-10 w-full bg-zinc-800/40 rounded-xl" />
                                    <div className="h-10 w-full bg-zinc-800/40 rounded-xl" />
                                    <div className="h-10 w-full bg-zinc-800/40 rounded-xl" />
                                </div>
                                <div className="h-12 w-full bg-zinc-800 rounded-xl mt-4" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTechnicians.length > 0 ? (
                            filteredTechnicians.map((tech) => (
                                <div
                                    key={`technician-profile-${tech.id}`}
                                    className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-emerald-500/40 flex flex-col justify-between"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="relative">
                                                <img
                                                    src={tech.image}
                                                    alt={tech.name}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
                                                    }}
                                                    className="h-16 w-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors"
                                                />
                                                {tech.verified && (
                                                    <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs shadow">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold group-hover:text-emerald-300 transition-colors">
                                                    {tech.name}
                                                </h3>
                                                <p className="text-xs font-semibold text-emerald-400">{tech.specialty}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 mb-8 text-sm text-zinc-300">
                                            <div className="flex items-center justify-between bg-zinc-800/40 px-4 py-2 rounded-xl border border-white/5">
                                                <span className="flex items-center gap-2 text-zinc-400">
                                                    <Award className="h-4 w-4 text-cyan-400" /> Experience
                                                </span>
                                                <span className="font-semibold text-white">{tech.experience}</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-zinc-800/40 px-4 py-2 rounded-xl border border-white/5">
                                                <span className="flex items-center gap-2 text-zinc-400">
                                                    <MapPin className="h-4 w-4 text-rose-400" /> Location
                                                </span>
                                                <span className="font-semibold text-white">{tech.location}</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-zinc-800/40 px-4 py-2 rounded-xl border border-white/5">
                                                <span className="flex items-center gap-2 text-zinc-400">
                                                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Rating
                                                </span>
                                                <span className="font-semibold text-white">
                                                    {tech.rating}{" "}
                                                    <span className="text-xs text-zinc-500">
                                                        ({tech.reviews} reviews)
                                                    </span>
                                                </span>
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
                )}
            </div>
        </div>
    );
}