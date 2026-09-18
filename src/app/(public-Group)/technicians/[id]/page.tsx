"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
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
    AlertCircle,
    Phone,
    Home
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

const ALL_SLOTS = [
    "09:00 AM - 11:00 AM",
    "11:30 AM - 01:30 PM",
    "02:30 PM - 04:30 PM",
    "05:00 PM - 07:00 PM",
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TechnicianProfilePage() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const technicianParamId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [technicianServices, setTechnicianServices] = useState<ServiceItem[]>([]);
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[]>(ALL_SLOTS);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isDayOff, setIsDayOff] = useState(false);

    useEffect(() => {
        async function fetchTechnicianAndServices() {
            setLoading(true);
            try {
                const res = await getAllServicesAction();
                const services: ServiceItem[] = res.data || [];

                const matchedServices = services.filter(
                    (s) =>
                        s.technicianId === technicianParamId ||
                        s.technician?.id === technicianParamId ||
                        s.technician?.userId === technicianParamId ||
                        s.id === technicianParamId
                );

                setTechnicianServices(matchedServices);
                if (matchedServices.length > 0) {
                    setSelectedService(matchedServices[0]);
                }

                // টেকনিশিয়ানের ড্যাশবোর্ড থেকে সেভ করা Active Slots রিড করা
                if (typeof window !== "undefined") {
                    const savedSlots = localStorage.getItem("tech_availability_slots");
                    if (savedSlots) {
                        const parsed = JSON.parse(savedSlots);
                        const activeList = parsed
                            .filter((s: { slot: string; active: boolean }) => s.active)
                            .map((s: { slot: string }) => s.slot);
                        if (activeList.length > 0) {
                            setAvailableSlots(activeList);
                            setSelectedSlot(activeList[0]);
                        }
                    } else {
                        setSelectedSlot(ALL_SLOTS[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to load technician services:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchTechnicianAndServices();
    }, [technicianParamId]);

    // ইউজার ডেট পরিবর্তন করলে চেক করবে টেকনিশিয়ান ঐদিন OFF কি না
    const handleDateChange = (dateVal: string) => {
        setSelectedDate(dateVal);
        if (!dateVal) return;

        const dateObj = new Date(dateVal);
        const dayName = WEEKDAYS[dateObj.getDay()];

        if (typeof window !== "undefined") {
            const savedDays = localStorage.getItem("tech_availability_days");
            if (savedDays) {
                const daysParsed = JSON.parse(savedDays);
                const matchedDay = daysParsed.find((d: { day: string; active: boolean }) => d.day === dayName);
                if (matchedDay && !matchedDay.active) {
                    setIsDayOff(true);
                    return;
                }
            }
        }
        setIsDayOff(false);
    };

    const primaryService = technicianServices[0];
    const technician = primaryService?.technician;
    const technicianName = technician?.user?.name || "Professional Technician";
    const technicianBio =
        technician?.bio ||
        primaryService?.description ||
        "Certified service professional ready for on-demand home repairs.";
    const technicianLocation = technician?.user?.address || "Dhaka, Bangladesh";
    const experienceYears = technician?.experience ? `${technician.experience} Years` : "5+ Years";
    const skillsList =
        technician?.skills && technician.skills.length > 0
            ? technician.skills
            : ["Inspection", "Maintenance", "Repair"];

    const currentPrice = selectedService?.price || primaryService?.price || 500;

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isDayOff) {
            alert("The technician is taking a break on this day. Please pick an active day.");
            return;
        }

        if (!selectedService?.id) {
            alert("Please choose a valid service.");
            return;
        }

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
            const combinedNotes = [
                notes ? `Notes: ${notes}` : "",
                customerPhone ? `Contact: ${customerPhone}` : "",
                customerAddress ? `Address: ${customerAddress}` : "",
            ]
                .filter(Boolean)
                .join(" | ");

            const res = await createBookingAction({
                serviceId: selectedService.id,
                technicianId: selectedService.technicianId || technician?.id || technicianParamId,
                technicianName: technicianName,
                date: selectedDate,
                timeSlot: selectedSlot,
                notes: combinedNotes,
            });

            if (res.success) {
                alert(`Booking request submitted successfully for ${selectedService.title}!`);
                window.location.replace("/customer-dashboard");
            } else {
                if (
                    res.message?.toLowerCase().includes("unauthorized") ||
                    res.message?.toLowerCase().includes("logged in")
                ) {
                    alert("Please log in first to book a service.");
                    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                    return;
                }
                alert(res.message || "Failed to create booking.");
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

    if (!primaryService) {
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
                <Link
                    href="/technicians"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Technicians
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Details */}
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
                                        <p className="text-sm text-zinc-400">
                                            {technicianServices.length} Services Available
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-semibold text-amber-400">4.9</span>
                                    <span className="text-xs text-zinc-500">(Verified Pro)</span>
                                </div>
                            </div>

                            <p className="text-zinc-300 text-sm leading-relaxed">{technicianBio}</p>

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
                                    <span>৳{currentPrice} starting rate</span>
                                </div>
                            </div>

                            {/* Skills List */}
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

                            {/* Services Provided by this Technician */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Services Offered By {technicianName}
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {technicianServices.map((serv) => {
                                        const isChosen = selectedService?.id === serv.id;
                                        return (
                                            <div
                                                key={serv.id}
                                                onClick={() => setSelectedService(serv)}
                                                className={`cursor-pointer p-4 rounded-2xl border transition-all ${isChosen
                                                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                                    : "border-white/10 bg-zinc-800/30 hover:border-white/20"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-semibold text-white">{serv.title}</h4>
                                                    <span className="text-xs font-bold text-cyan-400">৳{serv.price}</span>
                                                </div>
                                                <p className="text-xs text-zinc-400 line-clamp-2">{serv.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Booking Form */}
                    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-2xl p-6 shadow-2xl space-y-6 sticky top-24">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white">Book Appointment</h2>
                            <p className="text-xs text-cyan-400">
                                Selected Service: {selectedService?.title || "Choose below"}
                            </p>
                        </div>

                        <form onSubmit={handleBooking} className="space-y-4">
                            {/* Service Selector Dropdown */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Select Service
                                </Label>
                                <select
                                    value={selectedService?.id || ""}
                                    onChange={(e) => {
                                        const found = technicianServices.find((s) => s.id === e.target.value);
                                        if (found) setSelectedService(found);
                                    }}
                                    className="w-full h-11 rounded-xl bg-black/50 border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-cyan-500"
                                >
                                    {technicianServices.map((s) => (
                                        <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                                            {s.title} — ৳{s.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Picker */}
                            <div className="space-y-1.5">
                                <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Select Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={selectedDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    required
                                    className="bg-black/50 border-white/10 text-white h-11"
                                />
                                {isDayOff && (
                                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Technician is off on this weekday. Pick another date.
                                    </p>
                                )}
                            </div>

                            {/* Dynamic Time Slots based on Technician Availability */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Available Time Slots
                                </Label>
                                {availableSlots.length === 0 ? (
                                    <p className="text-xs text-amber-400 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        No active working slots configured by this technician.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                        {availableSlots.map((slot) => {
                                            const isSelected = selectedSlot === slot;
                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    disabled={isDayOff}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${isDayOff
                                                        ? "opacity-40 cursor-not-allowed border-white/5 bg-zinc-900"
                                                        : isSelected
                                                            ? "border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                                                            : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {slot}
                                                    </span>
                                                    {isSelected && !isDayOff && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-cyan-400" /> Contact Phone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="e.g. 017XXXXXXXX"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    required
                                    className="bg-black/50 border-white/10 text-white h-11 placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Address Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                    <Home className="h-3.5 w-3.5 text-cyan-400" /> Service Address
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="House, Road, Area (e.g. House 12, Banani)"
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    required
                                    className="bg-black/50 border-white/10 text-white h-11 placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Notes Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Problem Description (Optional)
                                </Label>
                                <Input
                                    id="notes"
                                    placeholder="Brief note about the issue..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-black/50 border-white/10 text-white h-11 placeholder:text-zinc-600"
                                />
                            </div>

                            {/* Total Cost Display */}
                            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                                <span className="text-zinc-400">Total Bill:</span>
                                <span className="text-xl font-bold text-cyan-400">৳{currentPrice}</span>
                            </div>

                            <Button
                                type="submit"
                                disabled={submitting || isDayOff}
                                className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting Request...
                                    </>
                                ) : isDayOff ? (
                                    "Technician Unavailable on this Date"
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