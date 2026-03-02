import { getMechanicJobsByUserId, getMechanicCompletedJobsByUserId, getServiceRequirements } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobCard } from "./job-card";
import { Wrench, CheckCircle } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = 'force-dynamic';

export default async function MechanicPage() {
    const session = await getSession();

    if (!session || session.role !== 'MECHANIC') {
        redirect('/login');
    }

    const activeJobs = await getMechanicJobsByUserId(session.user_id);
    const completedJobs = await getMechanicCompletedJobsByUserId(session.user_id);

    // Fetch requirements for each active job (if still needed for JobCard, otherwise remove)
    // Assuming JobCard now handles requirements internally or they are not displayed in this view
    // For now, keeping the original logic for active jobs to fetch requirements, but renaming 'jobs' to 'activeJobs'
    const jobsWithReqs = await Promise.all(activeJobs.map(async (job: any) => {
        const requirements = await getServiceRequirements(job.service_type_id);
        return { ...job, requirements };
    }));


    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/30 relative">
            <header className="px-8 flex justify-between items-center py-6 border-b border-white/5 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-black border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                        M
                    </div>
                    <div>
                        <h1 className="text-xl font-light tracking-widest uppercase text-white leading-tight">Technician <span className="text-primary font-bold">Portal</span></h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <LogoutButton />
                </div>
            </header>

            <main className="container max-w-7xl mx-auto py-12 px-4 md:px-8">
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                        <Wrench className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-light tracking-wide text-white">Active <span className="font-medium">Assignments</span></h2>
                    </div>
                    {jobsWithReqs.length === 0 ? (
                        <div className="glass p-12 text-center rounded-xl border-dashed border-white/10 opacity-70">
                            <p className="text-zinc-500 font-light tracking-wide">No active assignments at the moment. Enjoy your break!</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {jobsWithReqs.map((job) => (
                                <JobCard key={job.job_id} job={job} requirements={job.requirements} isActive={true} />
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
                        <CheckCircle className="w-5 h-5 text-zinc-500" />
                        <h2 className="text-2xl font-light tracking-wide text-zinc-300">Recently <span className="font-medium">Completed</span></h2>
                    </div>
                    {completedJobs.length === 0 ? (
                        <div className="glass p-12 text-center rounded-xl border-dashed border-white/10 opacity-70">
                            <p className="text-zinc-500 font-light tracking-wide">No completed assignments to display.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {completedJobs.map((job) => (
                                <JobCard key={job.job_id} job={job} isActive={false} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
