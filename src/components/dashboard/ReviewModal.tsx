"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { submitReviewAction } from "@/app/(dashboard-Group)/_actions/review";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: {
        id: string;
        service?: { name: string };
    } | null;
    onSuccess: () => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    booking,
    onSuccess,
}: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !booking) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await submitReviewAction({
            bookingId: booking.id,
            rating,
            comment,
        });

        setLoading(false);

        if (res.success) {
            onSuccess();
            onClose();
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                        <h3 className="text-lg font-bold">Leave a Review</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            {booking.service?.name || "Service Completed"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-xs text-zinc-400 mb-2 font-medium">
                            Rating
                        </label>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-7 h-7 transition-colors ${(hoverRating || rating) >= star
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-zinc-600"
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm font-semibold text-amber-400">
                                {hoverRating || rating} / 5
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
                            Your Feedback
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was the technician's service? Share your thoughts..."
                            className="w-full rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}