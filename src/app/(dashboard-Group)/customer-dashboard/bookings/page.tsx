"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    CreditCard,
    AlertCircle,
    RefreshCw,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerBookingsAction, cancelBookingAction } from "../../_actions/booking";

interface Booking {
    id: string;
    bookingDate?: string;
    date?: string;
    timeSlot?: string;
    status: "REQUESTED" | "ACCEPTED" | "DECLINED" | "PAID" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    service?: {
        title?: string;
        name?: string;
        technician?: {
            user?: {
                name?: string;
            };
        };
    };
    serviceName?: string;
    technicianName?: string;
}

export default function CustomerBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const res = await getCustomerBookingsAction();
            if (res.success && res.data) {
                setBookings(res.data);
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.error("Failed to load bookings", err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        setCancellingId(bookingId);
        try {
            const res = await cancelBookingAction(bookingId);
            if (res.success) {
                alert("Booking cancelled successfully.");
                loadBookings();
            } else {
                alert(res.message || "Failed to cancel booking.");
            }
        } catch (err) {
            console.error("Cancel failed", err);
            alert("Error cancelling booking.");
        } finally {
            setCancellingId(null);
        }
    };

    const renderBadge = (status: Booking["status"]) => {
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
                    <h2 className="text-2xl font-bold tracking-tight text-white">Booking Management</h2>
                    <p className="text-zinc-400 text-xs mt-1">Review live status, process payments, or cancel requests.</p>
                </div>
                <Button
                    onClick={loadBookings}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300"
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
                </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                {loading ? (
                    <div className="py-12 text-center text-zinc-400 text-sm">
                        Loading your bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-zinc-300">No bookings available</p>
                        <Link href="/technicians" className="mt-3 inline-block">
                            <Button size="sm" variant="outline" className="bg-white/5 border-white/10 text-cyan-400 text-xs">
                                Browse Technicians
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="border-b border-white/10 text-xs uppercase text-zinc-400 bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">Service</th>
                                    <th className="px-6 py-4">Technician</th>
                                    <th className="px-6 py-4">Schedule</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right rounded-r-xl">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bookings.map((booking) => {
                                    const serviceTitle = booking.service?.title || booking.service?.name || booking.serviceName || "Home Repair Service";
                                    const techName = booking.service?.technician?.user?.name || booking.technicianName || "Assigned Pro";
                                    const rawDate = booking.bookingDate || booking.date;
                                    const canCancel = ["REQUESTED", "ACCEPTED"].includes(booking.status);
                                    const needsPayment = booking.status === "ACCEPTED";
                                    const canReview = booking.status === "COMPLETED";

                                    return (
                                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {serviceTitle}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300">
                                                {techName}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                                    <span>{rawDate ? new Date(rawDate).toLocaleDateString() : "TBD"}</span>
                                                </div>
                                                {booking.timeSlot && (
                                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{booking.timeSlot}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                {needsPayment && (
                                                    <Link href={`/dashboard/customer/bookings/${booking.id}/pay`}>
                                                        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
                                                            <CreditCard className="h-3.5 w-3.5" /> Pay Now
                                                        </Button>
                                                    </Link>
                                                )}

                                                {canReview && (
                                                    <Link href={`/reviews/new?bookingId=${booking.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 bg-white/5 border-white/10 hover:bg-white/10 text-amber-400 text-xs">
                                                            Review
                                                        </Button>
                                                    </Link>
                                                )}

                                                {canCancel && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                                                        disabled={cancellingId === booking.id}
                                                        onClick={() => handleCancel(booking.id)}
                                                    >
                                                        {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                                                    </Button>
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