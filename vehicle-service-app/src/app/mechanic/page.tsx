import { getMechanicJobs } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Clock, CheckCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MechanicPage() {
    // Hardcoded for MVP: Mechanic ID 1 (Mike)
    const jobs = await getMechanicJobs(1);

    return (
        <div className="min-h-screen bg-background p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Mechanic Portal</h1>
                <p className="text-muted-foreground">Welcome back, Mike Davidson. Here are your active jobs.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.length === 0 && (
                    <p className="text-muted-foreground col-span-full">No active jobs assigned.</p>
                )}
                {jobs.map((job: any) => (
                    <Card key={job.job_id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{job.service_name}</CardTitle>
                                    <p className="text-sm text-blue-400 font-medium">Order #{job.order_id}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                                    }`}>
                                    {job.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Wrench className="w-4 h-4" />
                                <span>{job.make} {job.model} ({job.license_plate})</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Due: {new Date(job.order_date).toLocaleDateString()}</span>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-xs text-muted-foreground mb-1">Customer</p>
                                <p className="text-sm font-medium text-white">{job.customer_name}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">Details</Button>
                            {job.status === 'ASSIGNED' && (
                                <Button size="sm">Start Job</Button>
                            )}
                            {job.status === 'IN_PROGRESS' && (
                                <Button size="sm" variant="secondary">Complete</Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
