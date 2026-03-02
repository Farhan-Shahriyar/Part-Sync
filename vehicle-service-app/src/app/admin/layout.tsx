import { AdminNav } from "@/components/admin-nav";
import { Wrench } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex selection:bg-primary/30 font-sans relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />

            <aside className="w-72 border-r border-white/5 glass p-6 flex flex-col gap-8 z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-gradient-to-b from-primary to-primary/60 rounded flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                        <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-extrabold tracking-widest uppercase text-white leading-none block text-lg">Part<span className="text-primary">Sync</span></span>
                        <span className="text-xs text-primary font-medium tracking-widest uppercase mt-1 block">Command Center</span>
                    </div>
                </div>
                <AdminNav />
            </aside>
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative z-10">
                {children}
            </main>
        </div>
    );
}
