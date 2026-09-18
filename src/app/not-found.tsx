import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-md space-y-6">
                <div className="h-20 w-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-xl shadow-cyan-500/10">
                    <Wrench className="h-10 w-10 text-cyan-400 -rotate-45" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
                    <p className="text-zinc-400 text-sm">
                        Sorry, the service or page you are looking for does not exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link href="/">
                        <Button className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl gap-2 shadow-lg shadow-cyan-500/20 font-semibold">
                            <Home className="h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                    <Link href="/services">
                        <Button variant="outline" className="h-11 px-6 border-white/10 text-white hover:bg-white/10 rounded-xl gap-2">
                            Explore Services
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}