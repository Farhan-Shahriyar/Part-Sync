import { AdminNav } from "@/components/admin-nav";
import { Card } from "@/components/ui/card";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex">
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
                        A
                    </div>
                    <span className="font-bold text-lg text-white">Admin Portal</span>
                </div>
                <AdminNav />
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
