"use client";

import { useEffect, useState } from "react";
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
    Loader2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBookingAction, getAllServicesAction } from "@/app/(dashboard-Group)/_actions/booking";

interface ServiceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    technicianId: string;
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

const AVAILABLE_SLOTS = [
    "09:00 AM - 11:00 AM",
    "11:30 AM - 01:30 PM",
    "02:30 PM - 04:30 PM",
    "05:00 PM - 07:00 PM",
];

export default function TechnicianProfilePage() {
    const params = useParams();
    const technicianParamId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [serviceData, setServiceData] = useState<ServiceItem | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(AVAILABLE_SLOTS[0]);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchTechnicianAndServices() {
            setLoading(true);
            try {
                // Calling Server Action to bypass browser network / CORS failure
                const res = await getAllServicesAction();
                const services: ServiceItem[] = res.data || [];

                // Match by technicianId, technician.userId, technician.id, or service.id
                const matched = services.find(
                    (s) =>
                        s.technicianId === technicianParamId ||
                        s.technician?.id === technicianParamId ||
                        s.technician?.userId === technicianParamId ||
                        s.id === technicianParamId
                );

                setServiceData(matched || services[0] || null);
            } catch (err) {
                console.error("Failed to load technician service:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTechnicianAndServices();
    }, [technicianParamId]);

    const technician = serviceData?.technician;
    const technicianName = technician?.user?.name || "Professional Technician";
    const technicianBio = technician?.bio || serviceData?.description || "Certified service professional ready for on-demand home repairs.";
    const technicianLocation = technician?.user?.address || "Dhaka, Bangladesh";
    const hourlyRate = technician?.hourlyRate || serviceData?.price || 500;
    const experienceYears = technician?.experience ? `${technician.experience} Years` : "5+ Years";
    const skillsList = technician?.skills && technician.skills.length > 0
        ? technician.skills
        : ["Inspection", "Maintenance", "Repair"];

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!serviceData?.id) {
            alert("Service details not loaded yet. Please try again.");
            return;
        }

        if (!selectedDate) {
            alert("Please pick a service date.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await createBookingAction({
                serviceId: serviceData.id,
                technicianId: serviceData.technicianId,
                technicianName: technicianName,
                date: selectedDate,
                timeSlot: selectedSlot,
                notes: notes,
            });

            if (res.success) {
                const newBookingId = res.data?.id;
                if (newBookingId && typeof window !== "undefined") {
                    const techMap = JSON.parse(localStorage.getItem("technician_names_map") || "{}");
                    techMap[newBookingId] = technicianName;
                    localStorage.setItem("technician_names_map", JSON.stringify(techMap));

                    const serviceMap = JSON.parse(localStorage.getItem("service_names_map") || "{}");
                    serviceMap[newBookingId] = serviceData.title;
                    localStorage.setItem("service_names_map", JSON.stringify(serviceMap));
                }

                alert(`Booking request submitted successfully for ${technicianName}!`);
                window.location.replace("/customer-dashboard");
            } else {
                alert(res.message || "Failed to create booking. Make sure you are logged in as a Customer.");
            }
        } catch (err) {
            console.error("Booking error:", err);
            alert("Something went wrong while placing your booking.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                <p className="text-sm text-zinc-400">Loading technician profile...</p>
            </div>
        );
    }

    if (!serviceData) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 space-y-4">
                <AlertCircle className="h-10 w-10 text-amber-400" />
                <h2 className="text-xl font-semibold">Technician Service Not Found</h2>
                <p className="text-sm text-zinc-400 text-center max-w-md">
                    No active service is registered for this technician yet in the database.
                </p>
                <Link href="/technicians">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                        Back to Technicians
                    </Button>
                </Link>
            </div>
        );
    }

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
                                        {technicianName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-bold text-white">{technicianName}</h1>
                                            <ShieldCheck className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <p className="text-sm text-zinc-400">{serviceData.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-semibold text-amber-400">4.9</span>
                                    <span className="text-xs text-zinc-500">(Verified Pro)</span>
                                </div>
                            </div>

                            <p className="text-zinc-300 text-sm leading-relaxed">
                                {technicianBio}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-sm">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <MapPin className="h-4 w-4 text-cyan-400" />
                                    <span>{technicianLocation}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Wrench className="h-4 w-4 text-indigo-400" />
                                    <span>{experienceYears}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <DollarSign className="h-4 w-4 text-emerald-400" />
                                    <span>৳{hourlyRate} base rate</span>
                                </div>
                            </div>

                            {/* Dynamic Skills */}
                            <div className="space-y-3 pt-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Specialized Skills
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {skillsList.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-zinc-300"
                                        >
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
                            <p className="text-xs text-zinc-400">Assigned Service: {serviceData.title}</p>
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