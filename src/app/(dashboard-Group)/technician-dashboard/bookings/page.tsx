"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Clock,
    User,
    Check,
    X,
    Play,
    CheckCircle,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTechnicianBookingsAction, updateBookingStatusAction } from "../../_actions/technician";

export default function TechnicianBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const loadBookings = async () => {
        setLoading(true);
        const res = await getTechnicianBookingsAction();
        if (res.success && res.data) {
            setBookings(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleStatusChange = async (bookingId: string, status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED") => {
        setUpdatingId(bookingId);
        const res = await updateBookingStatusAction(bookingId, status);
        if (res.success) {
            alert(`Booking marked as ${status}`);
            loadBookings();
        } else {
            alert(res.message || "Failed to change status");
        }
        setUpdatingId(null);
    };

    const renderBadge = (status: string) => {
        switch (status) {
            case "REQUESTED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">REQUESTED</span>;
            case "ACCEPTED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">ACCEPTED</span>;
            case "PAID":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">PAID</span>;
            case "IN_PROGRESS":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">IN PROGRESS</span>;
            case "COMPLETED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/15 text-zinc-300 border border-zinc-500/30">COMPLETED</span>;
            case "DECLINED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">DECLINED</span>;
            case "CANCELLED":
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-900/20 text-red-500 border border-red-800/30">CANCELLED</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Incoming Job Requests</h2>
                    <p className="text-zinc-400 text-xs mt-1">Accept requests, track customer payments, and update task progress.</p>
                </div>
                <Button onClick={loadBookings} variant="outline" size="sm" className="bg-white/5 border-white/10 text-zinc-300">
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
                </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                {loading ? (
                    <p className="py-12 text-center text-sm text-zinc-400">Loading incoming requests...</p>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-zinc-300">No incoming bookings found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="border-b border-white/10 text-xs uppercase text-zinc-400 bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">Customer</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Schedule</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bookings.map((booking) => {
                                    const isRequested = booking.status === "REQUESTED";
                                    const isPaid = booking.status === "PAID";
                                    const isInProgress = booking.status === "IN_PROGRESS";
                                    const isProcessing = updatingId === booking.id;

                                    return (
                                        <tr key={booking.id} className="hover:bg-white/[0.02]">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-cyan-400" />
                                                    <span className="font-medium text-white">
                                                        {booking.customer?.name || "Customer"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-500 ml-6">{booking.customer?.phone || ""}</p>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300">
                                                {booking.service?.title || "Home Repair"}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                                    <span>{new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {booking.timeSlot && (
                                                    <div className="flex items-center gap-1.5 text-zinc-500 mt-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{booking.timeSlot}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                {isRequested && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            disabled={isProcessing}
                                                            onClick={() => handleStatusChange(booking.id, "ACCEPTED")}
                                                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                                                        >
                                                            <Check className="h-3.5 w-3.5" /> Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            disabled={isProcessing}
                                                            onClick={() => handleStatusChange(booking.id, "DECLINED")}
                                                            className="h-8 text-rose-400 hover:bg-rose-500/10 text-xs gap-1"
                                                        >
                                                            <X className="h-3.5 w-3.5" /> Decline
                                                        </Button>
                                                    </div>
                                                )}

                                                {isPaid && (
                                                    <Button
                                                        size="sm"
                                                        disabled={isProcessing}
                                                        onClick={() => handleStatusChange(booking.id, "IN_PROGRESS")}
                                                        className="h-8 bg-cyan-600 hover:bg-cyan-700 text-white text-xs gap-1"
                                                    >
                                                        <Play className="h-3.5 w-3.5" /> Start Job
                                                    </Button>
                                                )}

                                                {isInProgress && (
                                                    <Button
                                                        size="sm"
                                                        disabled={isProcessing}
                                                        onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                                                        className="h-8 bg-zinc-700 hover:bg-zinc-600 text-white text-xs gap-1"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" /> Mark Completed
                                                    </Button>
                                                )}

                                                {!isRequested && !isPaid && !isInProgress && (
                                                    <span className="text-xs text-zinc-500 italic">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}