import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Shield, Zap } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="glass p-8 rounded-xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-colors duration-700" />
                <h1 className="text-4xl font-light tracking-wide text-white mb-2">Command <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Center</span></h1>
                <p className="text-zinc-400 font-light max-w-2xl">Manage operations, oversee inventory logistics, and monitor service execution with uncompromised precision.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass border-white/5 rounded-xl hover:border-primary/30 transition-colors bg-black/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Active Orders</CardTitle>
                        <Wrench className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-light text-white">Monitoring</div>
                    </CardContent>
                </Card>
                <Card className="glass border-white/5 rounded-xl hover:border-primary/30 transition-colors bg-black/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Inventory Health</CardTitle>
                        <Shield className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-light text-white">Optimal</div>
                    </CardContent>
                </Card>
                <Card className="glass border-white/5 rounded-xl hover:border-primary/30 transition-colors bg-black/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-widest">System Status</CardTitle>
                        <Zap className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-light text-white">Synchronized</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
