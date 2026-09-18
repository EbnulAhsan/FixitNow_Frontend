/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, Loader2, RefreshCw, Layers, CheckCircle2 } from "lucide-react";
import { getAllCategoriesAction, createCategoryAction } from "../../_actions/admin";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await getAllCategoriesAction();
            if (res.success && Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (err) {
            console.error("Categories fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setCreating(true);
        setFeedback(null);

        const res = await createCategoryAction({ name, description });

        setCreating(false);
        if (res.success) {
            setFeedback({ type: "success", msg: "Category created successfully!" });
            setName("");
            setDescription("");
            loadCategories();
        } else {
            setFeedback({ type: "error", msg: res.message || "Failed to create category" });
        }
    };

    return (
        <div className="space-y-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Category Management 🏷️</h2>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Add and manage home service categories visible across the platform.
                    </p>
                </div>
                <button
                    onClick={loadCategories}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-zinc-300 transition self-start sm:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {feedback && (
                <div
                    className={`p-4 rounded-2xl border text-sm flex items-center gap-2 ${feedback.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}
                >
                    <CheckCircle2 className="w-4 h-4" /> {feedback.msg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Category Form */}
                <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 h-fit space-y-4">
                    <div className="flex items-center gap-2 text-zinc-200">
                        <Plus className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold">Add New Category</h3>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Category Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Electrical Services"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Description</label>
                            <textarea
                                rows={3}
                                placeholder="Short overview of services under this category..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
                        >
                            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            Create Category
                        </button>
                    </form>
                </div>

                {/* Existing Categories List */}
                <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-zinc-200">
                        <Layers className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold">Active Categories ({categories.length})</h3>
                    </div>

                    {loading ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-2 text-zinc-400">
                            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                            <span className="text-xs">Loading platform categories...</span>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-white/10 rounded-2xl">
                            No categories created yet. Add one from the left panel.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition space-y-2"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white text-sm">{cat.name}</h4>
                                            <p className="text-[11px] text-zinc-400 line-clamp-1">
                                                {cat.description || "No description provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}