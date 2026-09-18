/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calendar, CheckCircle2, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { getCustomerPaymentsAction } from "../../_actions/payment";

export default function CustomerPaymentHistoryPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const res = await getCustomerPaymentsAction();
            if (res.success && Array.isArray(res.data)) {
                setPayments(res.data);
            }
        } catch (err) {
            console.error("Failed to load payment history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    return (
        <div className="space-y-8 text-white">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Payment History 💳</h2>
                <p className="text-zinc-400 mt-1 text-sm">
                    Review all your completed invoices and service transaction receipts.
                </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Invoices & Records</h3>
                    <button
                        onClick={loadPayments}
                        className="text-xs text-zinc-400 hover:text-white transition"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <p className="text-sm">Loading invoices...</p>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center">
                        <AlertCircle className="w-8 h-8 text-zinc-500 mb-2" />
                        <p className="text-zinc-300 font-medium">No payment history yet</p>
                        <p className="text-zinc-500 text-xs mt-1">
                            Your payments will appear here once you pay for accepted services.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="border-b border-white/10 text-xs uppercase text-zinc-400 bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">Service</th>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right rounded-r-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.map((p) => {
                                    const serviceName =
                                        p.booking?.service?.title ||
                                        p.booking?.service?.name ||
                                        "Home Service";
                                    const dateStr = p.paidAt || p.createdAt;

                                    return (
                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {serviceName}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                                                {p.transactionId ? `${p.transactionId.slice(0, 16)}...` : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                                    <span>{dateStr ? new Date(dateStr).toLocaleDateString() : "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-zinc-300">
                                                <div className="flex items-center gap-1.5">
                                                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                                                    <span>{p.provider || "Stripe"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-200 font-semibold">
                                                ৳{p.amount || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {p.status === "COMPLETED" ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                                        <CheckCircle2 className="w-3 h-3" /> Paid
                                                    </span>
                                                ) : p.status === "FAILED" ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                                                        <XCircle className="w-3 h-3" /> Failed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                                                        <Clock className="w-3 h-3" /> Pending
                                                    </span>
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