/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Users,
    Search,
    ShieldAlert,
    ShieldCheck,
    Loader2,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { getAllUsersAction, toggleUserStatusAction } from "../../_actions/admin";

export default function ManageUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsersAction();
            if (res.success && Array.isArray(res.data)) {
                setUsers(res.data);
            }
        } catch (err) {
            console.error("Failed to load users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        setUpdatingId(userId);
        const res = await toggleUserStatusAction(userId, currentStatus);
        if (res.success) {
            setUsers((prev) =>
                prev.map((u) => {
                    if (u.id === userId) {
                        const nextStatus =
                            u.status === "BLOCKED" || u.status === "BANNED" ? "ACTIVE" : "BLOCKED";
                        return { ...u, status: nextStatus };
                    }
                    return u;
                })
            );
        } else {
            alert(res.message || "Failed to update user status");
        }
        setUpdatingId(null);
    };

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const name = (u.name || "").toLowerCase();
            const email = (u.email || "").toLowerCase();
            const role = (u.role || "").toUpperCase();
            const matchesQuery =
                name.includes(searchQuery.toLowerCase()) ||
                email.includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === "ALL" || role === roleFilter;

            return matchesQuery && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    return (
        <div className="space-y-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Users 👥</h2>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Control platform accounts, filter by role, and manage ban/unban status.
                    </p>
                </div>

                <button
                    onClick={loadUsers}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-zinc-300 transition self-start sm:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {["ALL", "CUSTOMER", "TECHNICIAN", "ADMIN"].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${roleFilter === role
                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                                    : "bg-white/5 text-zinc-400 border border-white/5 hover:text-white"
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-zinc-400">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <span className="text-xs">Fetching users...</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-16 text-zinc-500 text-sm border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-zinc-600" />
                        No users matched your filter criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead className="border-b border-white/10 text-xs uppercase text-zinc-400 bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-xl">User Details</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right rounded-r-xl">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((u) => {
                                    const isBlocked = u.status === "BLOCKED" || u.status === "BANNED";
                                    return (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{u.name || "FixItNow Member"}</div>
                                                <div className="text-xs text-zinc-400">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${u.role === "ADMIN"
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                        : u.role === "TECHNICIAN"
                                                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                                                            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                        }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${isBlocked
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        }`}
                                                >
                                                    {isBlocked ? "BLOCKED" : "ACTIVE"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {u.role !== "ADMIN" && (
                                                    <button
                                                        disabled={updatingId === u.id}
                                                        onClick={() => handleToggleStatus(u.id, u.status)}
                                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition inline-flex items-center gap-1.5 disabled:opacity-50 ${isBlocked
                                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                                            : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                                                            }`}
                                                    >
                                                        {updatingId === u.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : isBlocked ? (
                                                            <>
                                                                <ShieldCheck className="w-3.5 h-3.5" /> Unban
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShieldAlert className="w-3.5 h-3.5" /> Ban User
                                                            </>
                                                        )}
                                                    </button>
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