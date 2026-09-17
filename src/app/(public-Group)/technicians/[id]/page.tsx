"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Wrench,
    Star,
    ShieldCheck,
    Clock,
    DollarSign,
    MapPin,
    CheckCircle2,
    ArrowLeft,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookingAction } from "@/app/(dashboard-Group)/_actions/booking";

const ALL_TECHNICIANS: Record<string, {
    id: string;
    name: string;
    role: string;
    rating: number;
    reviewsCount: number;
    experience: string;
    location: string;
    hourlyRate: number;
    skills: string[];
    bio: string;
}> = {
    "1": {
        id: "1",
        name: "Rahim Ahmed",
        role: "AC & Cooling Expert",
        rating: 4.9,
        reviewsCount: 124,
        experience: "6 Years",
        location: "Mirpur, Dhaka",
        hourlyRate: 45,
        skills: ["AC Repair", "Circuit Diagnosis", "Wiring Installation", "Gas Refill"],
        bio: "Specialized in troubleshooting complex residential cooling systems and electrical boards with safe, certified practices."
    },
    "2": {
        id: "2",
        name: "Tanvir Hossain",
        role: "Master Electrician",
        rating: 4.8,
        reviewsCount: 95,
        experience: "8 Years",
        location: "Gulshan, Dhaka",
        hourlyRate: 40,
        skills: ["Short Circuit Fix", "DB Board Setup", "Appliance Wiring", "Safety Breaker"],
        bio: "Experienced residential and commercial master electrician delivering clean circuitry and quick fault detection."
    },
    "3": {
        id: "3",
        name: "Kamal Uddin",
        role: "Plumbing & Sanitary Specialist",
        rating: 4.9,
        reviewsCount: 156,
        experience: "10 Years",
        location: "Dhanmondi, Dhaka",
        hourlyRate: 38,
        skills: ["Leakage Repair", "Pipeline Setup", "Motor Fitting", "Sanitary Lines"],
        bio: "Decade-long proven record fixing high-pressure pipelines, bathroom fittings, and residential pump motors."
    },
    "4": {
        id: "4",
        name: "Sharif Sarkar",
        role: "Woodwork & Furniture Carpenter",
        rating: 4.7,
        reviewsCount: 78,
        experience: "5 Years",
        location: "Uttara, Dhaka",
        hourlyRate: 32,
        skills: ["Door Locks", "Cabinet Fitting", "Furniture Restore", "Custom Polish"],
        bio: "Skilled woodwork expert specializing in solid wood restoration, kitchen cabinets, and secure architectural fittings."
    },
    "5": {
        id: "5",
        name: "Nazrul Islam",
        role: "Professional Home Painter",
        rating: 4.8,
        reviewsCount: 64,
        experience: "7 Years",
        location: "Mohakhali, Dhaka",
        hourlyRate: 22,
        skills: ["Wall Weather Coating", "Interior Paint", "Putty Finish", "Waterproofing"],
        bio: "High precision painter focused on surface longevity, damp proofing, and aesthetic texture finishes."
    },
    "6": {
        id: "6",
        name: "Jashim Uddin",
        role: "Pest Control & Safety Expert",
        rating: 4.9,
        reviewsCount: 110,
        experience: "9 Years",
        location: "Badda, Dhaka",
        hourlyRate: 28,
        skills: ["Termite Spray", "Cockroach Gel", "Bedbug Removal", "Disinfection"],
        bio: "Licensed safety consultant for residential pest elimination using odorless and child-safe chemicals."
    }
};

const AVAILABLE_SLOTS = [
    "09:00 AM - 11:00 AM",
    "11:30 AM - 01:30 PM",
    "02:30 PM - 04:30 PM",
    "05:00 PM - 07:00 PM",
];

export default function TechnicianProfilePage() {
    const params = useParams();
    const technicianId = (params?.id as string) || "1";


    const technician = ALL_TECHNICIANS[technicianId] || {
        ...ALL_TECHNICIANS["1"],
        id: technicianId,
        name: `Technician #${technicianId}`
    };

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDate) {
            alert("Please pick a service date.");
            return;
        }

        if (!selectedSlot) {
            alert("Please choose an available time slot.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await createBookingAction({
                technicianId: technician.id,
                technicianName: technician.name,
                date: selectedDate,
                timeSlot: selectedSlot,
                notes: notes,
            });

            if (res.success) {
                const newBookingId = res.data?.id;
                if (newBookingId && typeof window !== "undefined") {

                    const techMap = JSON.parse(localStorage.getItem("technician_names_map") || "{}");
                    techMap[newBookingId] = technician.name;
                    localStorage.setItem("technician_names_map", JSON.stringify(techMap));


                    const serviceMap = JSON.parse(localStorage.getItem("service_names_map") || "{}");
                    serviceMap[newBookingId] = `${technician.role || technician.name + "'s Special"} Service`;
                    localStorage.setItem("service_names_map", JSON.stringify(serviceMap));
                }

                alert(`Booking request submitted successfully for ${technician.name}!`);
                window.location.replace("/customer-dashboard");
            } else {
                alert(res.message || "Failed to create booking. Make sure you are logged in.");
            }
        } catch (err) {
            console.error("Booking error:", err);
            alert("Something went wrong while placing your booking.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 sm:p-12">
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Back Link */}
                <Link
                    href="/technicians"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Technicians
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left: Dynamic Technician Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-cyan-500/20">
                                        {technician.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-bold text-white">{technician.name}</h1>
                                            <ShieldCheck className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <p className="text-sm text-zinc-400">{technician.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-semibold text-amber-400">{technician.rating}</span>
                                    <span className="text-xs text-zinc-500">({technician.reviewsCount} reviews)</span>
                                </div>
                            </div>

                            <p className="text-zinc-300 text-sm leading-relaxed">
                                {technician.bio}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-sm">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <MapPin className="h-4 w-4 text-cyan-400" />
                                    <span>{technician.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Wrench className="h-4 w-4 text-indigo-400" />
                                    <span>{technician.experience}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <DollarSign className="h-4 w-4 text-emerald-400" />
                                    <span>${technician.hourlyRate}/hour</span>
                                </div>
                            </div>

                            {/* Dynamic Skills */}
                            <div className="space-y-3 pt-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Specialized Skills</Label>
                                <div className="flex flex-wrap gap-2">
                                    {technician.skills.map((skill) => (
                                        <span key={skill} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-zinc-300">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-2xl p-6 shadow-2xl space-y-6 sticky top-24">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white">Book Appointment</h2>
                            <p className="text-xs text-zinc-400">Booking session with {technician.name}</p>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Select Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                    className="bg-black/50 border-white/10 text-white h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Available Time Slots
                                </Label>
                                <div className="grid grid-cols-1 gap-2">
                                    {AVAILABLE_SLOTS.map((slot) => {
                                        const isSelected = selectedSlot === slot;
                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${isSelected
                                                    ? "border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                                                    : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {slot}
                                                </span>
                                                {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Job Details / Notes (Optional)
                                </Label>
                                <Input
                                    id="notes"
                                    placeholder="Describe the issue briefly..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-black/50 border-white/10 text-white h-11 placeholder:text-zinc-600"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Booking...
                                    </>
                                ) : (
                                    "Confirm Booking Request"
                                )}
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}