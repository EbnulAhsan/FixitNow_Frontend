/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
    getTechnicianBookingsAction,
    updateBookingStatusAction,
} from "@/app/(dashboard-Group)/_actions/technician";
import { CheckCircle, XCircle, Clock, Calendar, AlertCircle, Loader2 } from "lucide-react";

export default function TechnicianDashboard() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const res = await getTechnicianBookingsAction();
            if (res.success && Array.isArray(res.data)) {
                setBookings(res.data);
            }
        } catch (error) {
            console.error("Error loading bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
        setLoadingId(bookingId);
        try {
            const res = await updateBookingStatusAction(bookingId, newStatus);
            if (res.success) {
                setBookings((prev) =>
                    prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
                );
            } else {
                alert(res.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
        } finally {
            setLoadingId(null);
        }
    };

    const activeTasks = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED");
    const completedTasks = bookings.filter((b) => b.status === "COMPLETED");

    return (
        <div className="space-y-8 text-white">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Technician Portal 🔧</h2>
                <p className="text-zinc-400 mt-1">View your assigned service tasks, manage requests, and earnings.</p>
            </div>

            {/* Technician Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Active Requests</p>
                    <h3 className="text-4xl font-bold mt-2 text-cyan-400">{activeTasks.length}</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Completed Jobs</p>
                    <h3 className="text-4xl font-bold mt-2 text-emerald-400">{completedTasks.length}</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Total Bookings</p>
                    <h3 className="text-4xl font-bold mt-2 text-amber-400">{bookings.length}</h3>
                </div>
            </div>

            {/* Service Requests Container */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Incoming Service Requests</h3>
                    <button
                        onClick={loadBookings}
                        className="text-xs text-zinc-400 hover:text-white transition"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                        <span className="text-xs">Fetching your service requests...</span>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-zinc-500 text-sm py-12 text-center border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-zinc-600" />
                        No service requests assigned right now.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map((booking: any) => (
                            <div
                                key={booking.id}
                                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white">
                                            {booking.service?.name || "Service Request"}
                                        </span>
                                        <span
                                            className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${booking.status === "COMPLETED"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : booking.status === "CONFIRMED" || booking.status === "ACCEPTED"
                                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                                    : booking.status === "CANCELLED"
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {booking.bookingDate
                                                ? new Date(booking.bookingDate).toLocaleDateString()
                                                : "N/A"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {booking.timeSlot || "Not set"}
                                        </span>
                                    </div>
                                    {booking.notes && (
                                        <p className="text-xs text-zinc-400 italic">Notes: {booking.notes}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {booking.status === "PENDING" && (
                                        <>
                                            <button
                                                disabled={loadingId === booking.id}
                                                onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                                                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition disabled:opacity-50"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> Accept
                                            </button>
                                            <button
                                                disabled={loadingId === booking.id}
                                                onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                                                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition disabled:opacity-50"
                                            >
                                                <XCircle className="w-3.5 h-3.5" /> Decline
                                            </button>
                                        </>
                                    )}

                                    {(booking.status === "CONFIRMED" || booking.status === "ACCEPTED") && (
                                        <button
                                            disabled={loadingId === booking.id}
                                            onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition disabled:opacity-50"
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}