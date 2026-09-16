export default function TechnicianDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Technician Portal 🔧</h2>
                <p className="text-zinc-400 mt-1">View your assigned service tasks, earnings, and availability.</p>
            </div>

            {/* Technician Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Assigned Tasks</p>
                    <h3 className="text-4xl font-bold mt-2 text-cyan-400">3</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Completed Jobs</p>
                    <h3 className="text-4xl font-bold mt-2 text-emerald-400">42</h3>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
                    <p className="text-zinc-400 text-sm">Total Earnings</p>
                    <h3 className="text-4xl font-bold mt-2 text-amber-400">$1,850</h3>
                </div>
            </div>

            {/* Assigned Tasks Section */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6">
                <h3 className="text-xl font-bold mb-4">Incoming Service Requests</h3>
                <div className="text-zinc-500 text-sm py-8 text-center border border-dashed border-white/10 rounded-2xl">
                    No new service requests assigned right now. Stay tuned!
                </div>
            </div>
        </div>
    );
}