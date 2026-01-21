'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function assignMechanic(jobId: number, mechanicId: number) {
    if (!jobId || !mechanicId) return { error: 'Invalid selection' };

    try {
        await query(
            "UPDATE service_jobs SET mechanic_id = $1, status = 'ASSIGNED' WHERE job_id = $2",
            [mechanicId, jobId]
        );
    } catch (e) {
        console.error(e);
        return { error: 'Failed to assign mechanic' };
    }

    revalidatePath('/admin/jobs');
}
