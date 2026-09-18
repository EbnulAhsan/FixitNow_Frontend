"use client";

import { useState } from "react";
import {
    Clock,
    Calendar,
    CheckCircle2,
    Save,
    Sparkles,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_DAYS = [
    { day: "Monday", active: true },
    { day: "Tuesday", active: true },
    { day: "Wednesday", active: true },
    { day: "Thursday", active: true },
    { day: "Friday", active: false },
    { day: "Saturday", active: true },
    { day: "Sunday", active: true },
];

const DEFAULT_SLOTS = [
    { slot: "09:00 AM - 11:00 AM", active: true },
    { slot: "11:30 AM - 01:30 PM", active: true },
    { slot: "02:30 PM - 04:30 PM", active: true },
    { slot: "05:00 PM - 07:00 PM", active: false },
];

export default function TechnicianAvailabilityPage() {
    const [days, setDays] = useState(DEFAULT_DAYS);
    const [slots, setSlots] = useState(DEFAULT_SLOTS);
    const [isInstantAccept, setIsInstantAccept] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleDay = (index: number) => {
        const updated = [...days];
        updated[index].active = !updated[index].active;
        setDays(updated);
        setSaved(false);
    };

    const toggleSlot = (index: number) => {
        const updated = [...slots];
        updated[index].active = !updated[index].active;
        setSlots(updated);
        setSaved(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Local state বা backend action-এ সংরক্ষণ
        if (typeof window !== "undefined") {
            localStorage.setItem("tech_availability_days", JSON.stringify(days));
            localStorage.setItem("tech_availability_slots", JSON.stringify(slots));
            localStorage.setItem("tech_instant_accept", JSON.stringify(isInstantAccept));
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    Working Availability
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                        Live Schedule
                    </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                    Control which days and working shifts customers can book you for.
                </p>
            </div>

            {saved && (
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Availability schedule updated successfully!
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Working Days */}
                <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 md:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Active Service Days</h2>
                            <p className="text-xs text-zinc-400">Select which days of the week you are taking appointments.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
                        {days.map((d, idx) => (
                            <button
                                key={d.day}
                                type="button"
                                onClick={() => toggleDay(idx)}
                                className={`p-4 rounded-2xl border text-sm font-semibold transition-all flex flex-col items-center gap-2 ${d.active
                                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                    : "border-white/5 bg-zinc-950/40 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
                                    }`}
                            >
                                <span>{d.day.slice(0, 3)}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.active ? "bg-cyan-400 text-black font-bold" : "bg-zinc-800 text-zinc-400"
                                    }`}>
                                    {d.active ? "ON" : "OFF"}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Working Shift Slots */}
                <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 md:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Time Slots & Shifts</h2>
                            <p className="text-xs text-zinc-400">Enable or disable booking slots according to your daily routine.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {slots.map((s, idx) => (
                            <div
                                key={s.slot}
                                onClick={() => toggleSlot(idx)}
                                className={`cursor-pointer p-4 rounded-2xl border flex items-center justify-between transition-all ${s.active
                                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                                    : "border-white/5 bg-zinc-950/40 text-zinc-500 hover:border-white/10"
                                    }`}
                            >
                                <span className="text-sm font-medium">{s.slot}</span>
                                <span className={`text-xs px-2.5 py-1 rounded-xl border ${s.active
                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold"
                                    : "bg-zinc-800/40 border-white/5 text-zinc-500"
                                    }`}>
                                    {s.active ? "Available" : "Disabled"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instant Booking Preferences */}
                <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 md:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Auto-Accept Requests</h3>
                            <p className="text-xs text-zinc-400">Automatically confirm incoming appointments for available slots.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setIsInstantAccept(!isInstantAccept);
                            setSaved(false);
                        }}
                        className={`w-14 h-8 rounded-full transition-colors relative p-1 flex items-center ${isInstantAccept ? "bg-emerald-500" : "bg-zinc-800 border border-white/10"
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isInstantAccept ? "translate-x-6" : "translate-x-0"
                            }`} />
                    </button>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 gap-2"
                    >
                        <Save className="h-4 w-4" /> Save Schedule Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}