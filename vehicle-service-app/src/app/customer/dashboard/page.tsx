import { getCustomerStats } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Calendar, History, Plus } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default async function CustomerDashboard() {
    const session = await getSession();
    if (!session || session.role !== 'CUSTOMER') {
        redirect('/login');
    }

    const stats = await getCustomerStats(session.user_id);

    if (!stats) {
        return <div className="p-8">Loading profile...</div>;
    }

    const { customer, vehicles, bookings, history } = stats;

    return (
        <div className="min-h-screen bg-background p-8 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/20 p-8 rounded-xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
                <div className="relative z-10">
                    <h1 className="text-4xl font-light tracking-widest text-white uppercase mb-1">
                        My <span className="font-semibold text-primary">Garage</span>
                    </h1>
                    <p className="text-zinc-400 font-light tracking-wide">Welcome, {customer.first_name} {customer.last_name}</p>
                </div>
                <div className="flex gap-3 relative z-10 mt-4 md:mt-0">
                    <Link href="/customer/book">
                        <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-wider uppercase rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all h-10 px-6">
                            <Plus className="w-4 h-4 mr-2" /> Book Service
                        </Button>
                    </Link>
                    <LogoutButton />
                </div>
            </header>

            {/* Vehicles Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Car className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-2xl font-light tracking-wide text-white">Registered <span className="font-medium text-primary">Vehicles</span></h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.length === 0 && <p className="text-zinc-500 font-light">No vehicles registered.</p>}
                    {vehicles.map((v: any) => (
                        <Card key={v.vehicle_id} className="glass border-white/5 bg-black/40 hover:bg-white/5 transition-colors group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-white font-medium">{v.year} {v.make} {v.model}</CardTitle>
                                <CardDescription className="text-primary font-mono mt-1 tracking-widest">{v.license_plate}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs px-2 py-1 bg-white/10 rounded inline-block text-zinc-300 tracking-wider uppercase mt-2">
                                    {v.color}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Active Bookings */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-2xl font-light tracking-wide text-white">Service <span className="font-medium text-primary">Appointments</span></h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {bookings.length === 0 && <p className="text-zinc-500 font-light">No active service appointments.</p>}
                    {bookings.map((b: any) => (
                        <Card key={b.order_id} className="glass border-white/5 bg-black/40 hover:bg-white/5 transition-colors group">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-white font-medium">Service Order</CardTitle>
                                        <CardDescription className="text-primary font-mono mt-1 tracking-widest">#{b.order_id}</CardDescription>
                                    </div>
                                    <span className="text-primary text-[10px] uppercase font-bold tracking-widest bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                        {b.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-2 text-sm text-zinc-300">
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="text-zinc-500 font-light">Vehicle</span>
                                    <span className="font-semibold">{b.make} {b.model}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 font-light">Expected Return</span>
                                    <span>{b.expected_completion ? new Date(b.expected_completion).toLocaleDateString() : 'TBD'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* History */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <History className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-2xl font-light tracking-wide text-white">Service <span className="font-medium text-primary">History</span></h2>
                </div>
                <Card className="glass border-white/5 bg-black/40 overflow-hidden">
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left text-zinc-300">
                            <thead className="text-xs text-white uppercase tracking-widest bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Vehicle</th>
                                    <th className="px-6 py-4 font-medium">Service Info</th>
                                    <th className="px-6 py-4 text-right font-medium">Total Cost</th>
                                    <th className="px-6 py-4 text-right font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-light">No documented service history found.</td>
                                    </tr>
                                )}
                                {history.map((h: any) => (
                                    <tr key={h.order_id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(h.order_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{h.make} {h.model}</td>
                                        <td className="px-6 py-4 text-zinc-400">{h.service_name || 'Service Order'} <span className="text-xs text-zinc-600 block">#{h.order_id}</span></td>
                                        <td className="px-6 py-4 text-right text-primary font-medium tracking-wider">
                                            {h.total_amount ? `$${h.total_amount}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[10px] uppercase font-bold tracking-widest bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">
                                                {h.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
