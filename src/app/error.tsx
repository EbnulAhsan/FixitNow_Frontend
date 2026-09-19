"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("PAGE_CRASH_ERROR:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4 text-red-400">
                ⚠️ Runtime Crash Captured
            </div>
            <h2 className="text-2xl font-bold mb-2">Error Details:</h2>
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-4 max-w-3xl text-left text-red-300 text-xs font-mono overflow-auto mb-6 w-full max-h-[60vh]">
                <p className="font-bold text-red-400 mb-1 text-sm">Message:</p>
                <p className="mb-3 text-sm">{error.message || "No error message available"}</p>

                <p className="font-bold text-red-400 mb-1 text-sm">Stack Trace (ফাইলের নাম দেখতে নিচে স্ক্রোল করো):</p>
                <pre className="whitespace-pre-wrap text-zinc-400">
                    {error.stack || "No stack trace available"}
                </pre>

                {error.digest && (
                    <p className="text-xs text-zinc-500 mt-3">Digest: {error.digest}</p>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition"
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.href = "/"}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}