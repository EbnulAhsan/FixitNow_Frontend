export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Overview 🛡️</h2>
                <p className="text-zinc-400 mt-1">Manage users, technicians verification, and platform analytics.</p>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Total Users</p>
                    <h3 className="text-4xl font-bold mt-2 text-cyan-400">1,240</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Active Technicians</p>
                    <h3 className="text-4xl font-bold mt-2 text-emerald-400">85</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Total Bookings</p>
                    <h3 className="text-4xl font-bold mt-2 text-blue-400">430</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Platform Revenue</p>
                    <h3 className="text-4xl font-bold mt-2 text-fuchsia-400">$12,450</h3>
                </div>
            </div>

            {/* Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Pending Technician Approvals</h3>
                    <div className="text-zinc-500 text-sm py-8 text-center border border-dashed border-white/10 rounded-2xl">
                        No pending technician requests at the moment.
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent System Activities</h3>
                    <div className="text-zinc-500 text-sm py-8 text-center border border-dashed border-white/10 rounded-2xl">
                        Activity logs will appear here.
                    </div>
                </div>
            </div>
        </div>
    );
}