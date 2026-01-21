import { getMechanicJobsByUserId } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Clock, CheckCircle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MechanicPage() {
    const session = await getSession();
    if (!session || session.role !== 'MECHANIC') {
        redirect('/login');
    }

    const jobs = await getMechanicJobsByUserId(session.user_id);

    return (
        <div className="min-h-screen bg-background p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Mechanic Portal</h1>
                <p className="text-muted-foreground">Welcome back, {session.username}. Here are your active jobs.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.length === 0 && (
                    <p className="text-muted-foreground col-span-full">No active jobs assigned.</p>
                )}
                {jobs.map((job: any) => (
                    <Card key={job.job_id} className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{job.service_name}</CardTitle>
                                    <p className="text-sm text-orange-500 font-medium">Order #{job.order_id}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-700' : 'bg-orange-500/20 text-orange-600'
                                    }`}>
                                    {job.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Wrench className="w-4 h-4" />
                                <span className="font-semibold">{job.make} {job.model} ({job.license_plate})</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Due: {new Date(job.order_date).toLocaleDateString()}</span>
                            </div>
                            <div className="pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-1">Customer</p>
                                <p className="text-sm font-medium">{job.customer_name}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Details</Button>
                            {job.status === 'ASSIGNED' && (
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">Start Job</Button>
                            )}
                            {job.status === 'IN_PROGRESS' && (
                                <Button size="sm" variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">Complete</Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
