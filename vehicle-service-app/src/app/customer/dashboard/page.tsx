import { getCustomerStats } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Calendar, History, Plus } from "lucide-react";
import Link from "next/link";

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
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                        My Garage
                    </h1>
                    <p className="text-muted-foreground">Welcome, {customer.first_name} {customer.last_name}</p>
                </div>
                <Link href="/customer/book">
                    <Button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold hover:shadow-lg transition-shadow">
                        <Plus className="w-4 h-4 mr-2" /> Book Service
                    </Button>
                </Link>
            </header>

            {/* Vehicles Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <Car className="w-5 h-5 text-orange-500" />
                    <h2>My Vehicles</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.length === 0 && <p className="text-muted-foreground">No vehicles registered.</p>}
                    {vehicles.map((v: any) => (
                        <Card key={v.vehicle_id} className="border-l-4 border-l-orange-400">
                            <CardHeader>
                                <CardTitle>{v.year} {v.make} {v.model}</CardTitle>
                                <CardDescription>{v.license_plate}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm px-2 py-1 bg-secondary rounded inline-block text-secondary-foreground">
                                    {v.color}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Active Bookings */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    <h2>Active Bookings</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {bookings.length === 0 && <p className="text-muted-foreground">No active service bookings.</p>}
                    {bookings.map((b: any) => (
                        <Card key={b.order_id} className="border-l-4 border-l-rose-500">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle>Service Order #{b.order_id}</CardTitle>
                                    <span className="text-rose-500 font-bold text-sm bg-rose-100 px-2 py-1 rounded">
                                        {b.status}
                                    </span>
                                </div>
                                <CardDescription>
                                    {new Date(b.order_date).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="font-medium">{b.make} {b.model}</p>
                                <p className="text-sm text-muted-foreground">Expected: {b.expected_completion ? new Date(b.expected_completion).toLocaleDateString() : 'TBD'}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* History */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <History className="w-5 h-5 text-amber-500" />
                    <h2>Service History</h2>
                </div>
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Vehicle</th>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3 text-right">Cost</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">No past service history.</td>
                                    </tr>
                                )}
                                {history.map((h: any) => (
                                    <tr key={h.order_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                        <td className="px-6 py-4">{new Date(h.order_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">{h.make} {h.model}</td>
                                        <td className="px-6 py-4">{h.service_name || 'Service Order'}</td>
                                        <td className="px-6 py-4 text-right">${h.total_amount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
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
