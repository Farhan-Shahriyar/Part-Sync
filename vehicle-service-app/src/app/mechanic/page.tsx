import { getMechanicJobsByUserId, getServiceRequirements } from "@/lib/queries"; // Updated import
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobCard } from "./job-card";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = 'force-dynamic';

export default async function MechanicPage() {
    const session = await getSession();
    if (!session || session.role !== 'MECHANIC') {
        redirect('/login');
    }

    const jobs = await getMechanicJobsByUserId(session.user_id);

    // Fetch requirements for each job
    const jobsWithReqs = await Promise.all(jobs.map(async (job: any) => {
        const requirements = await getServiceRequirements(job.service_type_id);
        return { ...job, requirements };
    }));

    return (
        <div className="min-h-screen bg-background p-8">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Mechanic Portal</h1>
                    <p className="text-muted-foreground">Welcome back, {session.username}. Here are your active jobs.</p>
                </div>
                <LogoutButton />
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobsWithReqs.length === 0 && (
                    <p className="text-muted-foreground col-span-full">No active jobs assigned.</p>
                )}
                {jobsWithReqs.map((job) => (
                    <JobCard key={job.job_id} job={job} requirements={job.requirements} />
                ))}
            </div>
        </div>
    );
}
