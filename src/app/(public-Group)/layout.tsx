import Navbar from "@/components/shared/Navbar";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
            <Navbar />
            {/* pt-20 মুছে দিলাম, যাতে হিরো সেকশন একদম ওপর থেকে শুরু হয় */}
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}