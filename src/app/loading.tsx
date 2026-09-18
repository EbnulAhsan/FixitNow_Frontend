export default function Loading() {
    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-zinc-950 text-white space-y-6 px-4">
            {/* Glowing Spinner */}
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
            </div>

            {/* Skeleton Placeholder Bars */}
            <div className="space-y-3 w-full max-w-sm flex flex-col items-center">
                <div className="h-4 w-48 bg-zinc-800/80 rounded-full animate-pulse" />
                <div className="h-3 w-32 bg-zinc-900 rounded-full animate-pulse" />
            </div>
        </div>
    );
}