/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
    Search,
    ArrowRight,
    ThermometerSnowflake,
    Zap,
    Droplet,
    Wrench,
    Paintbrush,
    ShieldAlert,
    Star,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllServicesAction } from "@/app/(dashboard-Group)/_actions/booking";
import { getAllCategoriesAction } from "@/app/(dashboard-Group)/_actions/admin";

// Category onujayi dynamic icon & color mapping
const getCategoryTheme = (categoryName: string = "") => {
    const cat = (categoryName || "").toLowerCase();
    if (cat.includes("cool") || cat.includes("ac")) {
        return { icon: ThermometerSnowflake, color: "text-cyan-400", bgColor: "bg-cyan-500/10" };
    }
    if (cat.includes("elect")) {
        return { icon: Zap, color: "text-blue-400", bgColor: "bg-blue-500/10" };
    }
    if (cat.includes("plumb")) {
        return { icon: Droplet, color: "text-emerald-400", bgColor: "bg-emerald-500/10" };
    }
    if (cat.includes("paint")) {
        return { icon: Paintbrush, color: "text-fuchsia-400", bgColor: "bg-fuchsia-500/10" };
    }
    if (cat.includes("clean") || cat.includes("pest")) {
        return { icon: ShieldAlert, color: "text-rose-400", bgColor: "bg-rose-500/10" };
    }
    return { icon: Wrench, color: "text-amber-400", bgColor: "bg-amber-500/10" };
};

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setLoading(true);
            try {
                // দুটি কলকে ইন্ডিপেন্ডেন্ট রাখা হলো যাতে একটি ফেইল করলেও অন্যটি পেজ ক্র্যাশ না করায়
                const [servicesRes, categoriesRes] = await Promise.allSettled([
                    getAllServicesAction(),
                    getAllCategoriesAction(),
                ]);

                if (!isMounted) return;

                // Services Data Process
                if (servicesRes.status === "fulfilled" && servicesRes.value?.success && Array.isArray(servicesRes.value.data)) {
                    setServices(servicesRes.value.data);
                }

                // Categories Data Process
                if (categoriesRes.status === "fulfilled" && categoriesRes.value?.success && Array.isArray(categoriesRes.value.data)) {
                    const categoryNames = categoriesRes.value.data
                        .map((c: any) => (typeof c === "string" ? c : c?.name))
                        .filter(Boolean);
                    setCategories(["All", ...Array.from(new Set(categoryNames))]);
                }
            } catch (err) {
                console.error("Failed to load services page data:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Real-time filtering
    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const title = (service.name || service.title || "").toLowerCase();
            const desc = (service.description || "").toLowerCase();
            const cat = (service.category?.name || service.category || "").toLowerCase();

            const matchesSearch =
                title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === "All" || cat === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [services, searchTerm, selectedCategory]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white pb-24 selection:bg-cyan-500/30">
            {/* Background Glow Orbs */}
            <div className="absolute top-[10%] left-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
            <div className="absolute top-[50%] right-[-10%] h-[40rem] w-[40rem] animate-pulse rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 md:px-6 pt-16">
                {/* Page Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300 backdrop-blur-md">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400" /> Verified Professional Services
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Explore All Available{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
                            Services
                        </span>
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

                {/* Loading Spinner */}
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-400">
                        <Loader2 className="w-9 h-9 animate-spin text-cyan-400" />
                        <span className="text-sm">Fetching verified services...</span>
                    </div>
                ) : (
                    /* Services Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service) => {
                                const categoryName =
                                    service.category?.name || service.category || "General";
                                const theme = getCategoryTheme(categoryName);
                                const Icon = theme.icon;

                                const targetId =
                                    service.technicianId ||
                                    service.technician?.id ||
                                    service.userId ||
                                    service.id;

                                const priceDisplay =
                                    service.price !== undefined
                                        ? `৳${service.price}`
                                        : service.fee !== undefined
                                            ? `৳${service.fee}`
                                            : "৳500";

                                return (
                                    <div
                                        key={service.id}
                                        className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-cyan-500/40 flex flex-col justify-between"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div
                                                    className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${theme.bgColor}`}
                                                >
                                                    <Icon className={`h-8 w-8 ${theme.color}`} />
                                                </div>
                                                <div className="flex items-center gap-1 bg-zinc-800/80 px-3 py-1 rounded-full border border-white/5 text-xs font-semibold text-amber-400">
                                                    <Star className="h-3.5 w-3.5 fill-current" />{" "}
                                                    {service.rating || "4.9"}
                                                </div>
                                            </div>

                                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                                                {categoryName}
                                            </span>
                                            <h3 className="text-2xl font-bold mt-1 mb-3 group-hover:text-cyan-300 transition-colors">
                                                {service.name || service.title}
                                            </h3>

                                            <p className="text-zinc-400 text-base leading-relaxed mb-6 line-clamp-3">
                                                {service.description ||
                                                    "Certified repair and maintenance solution delivered right at your location with guaranteed quality."}
                                            </p>
                                        </div>

                                        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between mt-auto">
                                            <div>
                                                <span className="text-xs text-zinc-500 block">Estimated Price</span>
                                                <span className="text-lg font-bold text-white">{priceDisplay}</span>
                                            </div>

                                            <Link href={`/technicians/${targetId}`}>
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
                )}
            </div>
        </div>
    );
}