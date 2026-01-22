import { getAllOrders, getAllMechanics } from "@/lib/queries";
import { query } from "@/lib/db"; // Direct query for jobs, or add to queries.ts (Adding here for speed)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, User, Calendar, DollarSign, Wrench } from "lucide-react";
import Link from "next/link";
import { AssignJobButton } from "./assign-job-button";

export const dynamic = 'force-dynamic';

async function getOrderJobs(orderId: number) {
    const res = await query(`
        SELECT sj.*, s.name as service_name, m.first_name || ' ' || m.last_name as mechanic_name
        FROM service_jobs sj
        JOIN service_types s ON sj.service_type_id = s.service_type_id
        LEFT JOIN mechanics m ON sj.mechanic_id = m.mechanic_id
        WHERE sj.order_id = $1
    `, [orderId]);
    return res.rows;
}

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();
    const mechanics = await getAllMechanics();

    // Fetch jobs for each order
    const ordersWithJobs = await Promise.all(orders.map(async (order: any) => {
        const jobs = await getOrderJobs(order.order_id);
        return { ...order, jobs };
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Service Orders</h1>

            <div className="space-y-4">
                {ordersWithJobs.map((order: any) => (
                    <Card key={order.order_id} className="hover:bg-white/5 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-semibold">Order #{order.order_id}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase
                                            ${order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                                                order.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-500' :
                                                    order.status === 'PENDING' ? 'bg-blue-500/20 text-blue-500' :
                                                        'bg-gray-500/20 text-gray-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {order.customer_name}</span>
                                        <span className="flex items-center gap-1"><Car className="w-3 h-3" /> {order.vehicle_info}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.order_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
                                        <p className="text-lg font-bold flex items-center justify-end gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            {order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}
                                        </p>
                                    </div>
                                    <div className="text-right border-l pl-6">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Jobs</p>
                                        <p className="text-lg font-bold">{order.job_count}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Jobs List */}
                            <div className="border-t pt-4 space-y-2">
                                <h4 className="text-sm font-semibold mb-2">Service Jobs</h4>
                                {order.jobs.map((job: any) => (
                                    <div key={job.job_id} className="flex justify-between items-center bg-muted/50 p-2 rounded text-sm">
                                        <div>
                                            <span className="font-medium">{job.service_name}</span>
                                            <span className="text-xs text-muted-foreground ml-2">({job.status})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {job.mechanic_name ? (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                    Mecha: {job.mechanic_name}
                                                </span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-yellow-500 italic">Unassigned</span>
                                                    <AssignJobButton jobId={job.job_id} mechanics={mechanics} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
