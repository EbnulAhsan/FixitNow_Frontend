"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global boundary caught error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute h-96 w-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-md space-y-6">
                <div className="h-20 w-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-xl shadow-rose-500/10">
                    <AlertCircle className="h-10 w-10 text-rose-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Something Went Wrong!</h2>
                    <p className="text-zinc-400 text-sm">
                        An unexpected error occurred while loading this section. Please try again or head back home.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                        onClick={() => reset()}
                        className="h-11 px-6 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl gap-2 shadow-lg shadow-rose-500/20 font-semibold"
                    >
                        <RotateCcw className="h-4 w-4" /> Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="h-11 px-6 border-white/10 text-white hover:bg-white/10 rounded-xl gap-2">
                            <Home className="h-4 w-4" /> Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}