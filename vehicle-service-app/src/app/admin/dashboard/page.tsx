import { getDashboardStats } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, DollarSign, Wrench, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const { revenueCtx, lowStock, topMechanics, pendingJobs } = await getDashboardStats();

    const currentMonthRevenue = revenueCtx[0]?.monthly_revenue || 0;
    const lastMonthRevenue = revenueCtx[1]?.monthly_revenue || 0;
    const growth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                    Service Center Dashboard
                </h2>
                <p className="text-muted-foreground">
                    Real-time overview of operations and performance.
                </p>
            </div>

            {/* KPI Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue (Month)</CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${currentMonthRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className={growth >= 0 ? "text-green-500" : "text-red-500"}>
                                {growth > 0 ? "+" : ""}{growth.toFixed(1)}%
                            </span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Assignments</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingJobs}</div>
                        <p className="text-xs text-muted-foreground mt-1">Jobs awaiting mechanic</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-rose-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Jobs Completed</CardTitle>
                        <Activity className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{revenueCtx[0]?.total_orders || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Updates live</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStock.length} Items</div>
                        <p className="text-xs text-muted-foreground mt-1">Require attention</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Mechanics</CardTitle>
                        <Users className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topMechanics.length} Top</div>
                        <p className="text-xs text-muted-foreground mt-1">Performers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                {/* Revenue Chart Placeholder / List */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {revenueCtx.map((m: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        <span className="font-medium">{m.month_name.trim()} {m.yr}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold">${m.monthly_revenue.toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground">{m.total_orders} Orders</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock & Mechanics */}
                <div className="col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                Critically Low Stock
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {lowStock.map((item: any, i: number) => (
                                    <li key={i} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{item.part_name}</p>
                                            <p className="text-xs text-muted-foreground">{item.part_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-red-400 font-bold block">{item.quantity_on_hand} left</span>
                                            <span className="text-xs text-muted-foreground">Reorder at {item.reorder_level}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-5 w-5 text-purple-500" />
                                Top Mechanics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {topMechanics.map((mech: any, i: number) => (
                                    <li key={i} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center font-bold text-xs text-white">
                                                {mech.mechanic.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <span className="font-medium">{mech.mechanic}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold">${mech.total_revenue.toLocaleString()}</span>
                                            <span className="text-xs text-muted-foreground">{mech.total_jobs_completed} Jobs</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
