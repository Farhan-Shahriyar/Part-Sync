import { query } from "@/lib/db";
import { assignMechanic } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getJobs() {
    const res = await query(`
        SELECT 
            sj.job_id, sj.status, sj.mechanic_id, 
            so.order_date, c.first_name, c.last_name, 
            v.make, v.model, v.license_plate,
            st.name as service_name,
            m.first_name as mech_first, m.last_name as mech_last
        FROM service_jobs sj
        JOIN service_orders so ON sj.order_id = so.order_id
        JOIN customers c ON so.customer_id = c.customer_id
        JOIN vehicles v ON so.vehicle_id = v.vehicle_id
        JOIN service_types st ON sj.service_type_id = st.service_type_id
        LEFT JOIN mechanics m ON sj.mechanic_id = m.mechanic_id
        ORDER BY 
            CASE WHEN sj.status = 'PENDING' THEN 1 ELSE 2 END,
            so.order_date DESC
    `);
    return res.rows;
}

async function getMechanics() {
    const res = await query("SELECT mechanic_id, first_name, last_name, specialty FROM mechanics WHERE is_active = true");
    return res.rows;
}

export default async function AdminJobsPage() {
    const jobs = await getJobs();
    const mechanics = await getMechanics();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Job Management
            </h1>

            <div className="grid gap-4">
                {jobs.map((job: any) => (
                    <Card key={job.job_id} className={`border-l-4 ${job.status === 'PENDING' ? 'border-l-rose-500' : 'border-l-green-500'}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{job.service_name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">Order Date: {new Date(job.order_date).toLocaleDateString()}</p>
                                </div>
                                <Badge variant={job.status === 'PENDING' ? 'destructive' : 'default'}>
                                    {job.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="font-semibold">Customer:</p>
                                    <p>{job.first_name} {job.last_name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Vehicle:</p>
                                    <p>{job.year} {job.make} {job.model} ({job.license_plate})</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t border-border flex justify-between items-center bg-muted/20">
                            <div className="text-sm">
                                <span className="font-semibold mr-1">Mechanic:</span>
                                {job.mech_first ? (
                                    <span className="text-green-600 font-bold">{job.mech_first} {job.mech_last}</span>
                                ) : (
                                    <span className="text-rose-500 italic">Unassigned</span>
                                )}
                            </div>

                            {job.status === 'PENDING' && (
                                <form action={async (formData) => {
                                    'use server'
                                    const mechId = parseInt(formData.get('mechanicId') as string);
                                    await assignMechanic(job.job_id, mechId);
                                }} className="flex gap-2 items-center">
                                    <select name="mechanicId" className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none" required>
                                        <option value="">Select Mechanic</option>
                                        {mechanics.map((m: any) => (
                                            <option key={m.mechanic_id} value={m.mechanic_id}>
                                                {m.first_name} {m.last_name} ({m.specialty})
                                            </option>
                                        ))}
                                    </select>
                                    <Button size="sm" type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                                        Assign
                                    </Button>
                                </form>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
