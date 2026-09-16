export default function CustomerDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome Back, Customer! 👋</h2>
                <p className="text-zinc-400 mt-1">Manage your service bookings and track active requests.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Total Bookings</p>
                    <h3 className="text-4xl font-bold mt-2 text-cyan-400">4</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Active Services</p>
                    <h3 className="text-4xl font-bold mt-2 text-emerald-400">1</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Completed</p>
                    <h3 className="text-4xl font-bold mt-2 text-blue-400">3</h3>
                </div>
            </div>

            {/* Recent Bookings Table Section */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
                <div className="text-zinc-500 text-sm py-8 text-center border border-dashed border-white/10 rounded-2xl">
                    No recent bookings found. Explore services to book your first professional!
                </div>
            </div>
        </div>
    );
}