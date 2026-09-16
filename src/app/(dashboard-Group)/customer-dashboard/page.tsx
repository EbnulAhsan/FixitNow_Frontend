"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    ArrowUpRight,
    Loader2,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerBookingsAction } from "../_actions/booking";

interface Booking {
    id: string;
    serviceName?: string;
    service?: { name: string };
    technicianName?: string;
    technician?: { name: string };
    date: string;
    timeSlot?: string;
    status: "REQUESTED" | "ACCEPTED" | "DECLINED" | "PAID" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    totalAmount?: number;
    price?: number;
}

export default function CustomerDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    // কুকি থেকে টোকেন পড়ার হেল্পার ফাংশন
    const getAuthToken = () => {
        if (typeof document === "undefined") return "";
        const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
        return match ? match[2] : "";
    };

    const fetchBookings = async () => {
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
        fetchBookings();
    }, []);

    // বুকিং ক্যানসেল করার হ্যান্ডলার (IN_PROGRESS বা COMPLETED হলে ক্যানসেল করা যাবে না)
    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        setCancellingId(bookingId);
        try {
            const token = getAuthToken();
            const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                alert("Booking cancelled successfully.");
                fetchBookings();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to cancel booking.");
            }
        } catch (err) {
            alert("Error cancelling booking.");
        } finally {
            setCancellingId(null);
        }
    };

    // রিকোয়ারমেন্টের নির্দিষ্ট স্ট্যাটাস ব্যাজ স্টাইলিং
    const renderStatusBadge = (status: Booking["status"]) => {
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
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-700/20 text-zinc-400">{status}</span>;
        }
    };

    // ক্যালকুলেটেড স্ট্যাটিস্টিকস
    const totalBookings = bookings.length;
    const activeServices = bookings.filter((b) => ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status)).length;
    const completedServices = bookings.filter((b) => b.status === "COMPLETED").length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back! 👋</h2>
                    <p className="text-zinc-400 mt-1 text-sm">Manage your service bookings and track real-time job progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={fetchBookings}
                        variant="outline"
                        size="sm"
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </Button>
                    <Link href="/services">
                        <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2">
                            Book New Service <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm font-medium">Total Bookings</p>
                    <h3 className="text-4xl font-bold mt-2 text-cyan-400">{totalBookings}</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm font-medium">Active Services</p>
                    <h3 className="text-4xl font-bold mt-2 text-emerald-400">{activeServices}</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm font-medium">Completed</p>
                    <h3 className="text-4xl font-bold mt-2 text-blue-400">{completedServices}</h3>
                </div>
            </div>

            {/* Bookings Table Section */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
                    <span className="text-xs text-zinc-500">Live Status Feed</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                        <p className="text-sm">Fetching your booking details...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl p-6">
                        <AlertCircle className="h-10 w-10 text-zinc-500 mx-auto mb-3" />
                        <p className="text-zinc-300 font-medium">No bookings found</p>
                        <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
                            You haven't requested any home repair services yet. Check out available technicians to book.
                        </p>
                        <Link href="/services" className="mt-4 inline-block">
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-cyan-400 hover:bg-white/10">
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
                                    const canCancel = ["REQUESTED", "ACCEPTED"].includes(booking.status);
                                    const needsPayment = booking.status === "ACCEPTED";
                                    const canReview = booking.status === "COMPLETED";

                                    return (
                                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {booking.serviceName || booking.service?.name || "Home Repair Service"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {booking.technicianName || booking.technician?.name || "Assigned Technician"}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                                    <span>{booking.date ? new Date(booking.date).toLocaleDateString() : "TBD"}</span>
                                                </div>
                                                {booking.timeSlot && (
                                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{booking.timeSlot}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                {/* Accepted হলে পে করার অপশন */}
                                                {needsPayment && (
                                                    <Link href={`/dashboard/customer/bookings/${booking.id}/pay`}>
                                                        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-md">
                                                            <CreditCard className="h-3.5 w-3.5" /> Pay Now
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* Completed হলে রিভিউ দেওয়ার অপশন */}
                                                {canReview && (
                                                    <Link href={`/reviews/new?bookingId=${booking.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 bg-white/5 border-white/10 hover:bg-white/10 text-amber-400 text-xs">
                                                            Leave Review
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* ক্যানসেল বাটন */}
                                                {canCancel && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                                                        disabled={cancellingId === booking.id}
                                                        onClick={() => handleCancelBooking(booking.id)}
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