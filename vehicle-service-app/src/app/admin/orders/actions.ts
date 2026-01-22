'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function assignJob(jobId: number, mechanicId: number) {
    try {
        await query(
            "UPDATE service_jobs SET mechanic_id = $1, status = 'ASSIGNED' WHERE job_id = $2",
            [mechanicId, jobId]
        );
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign job:", error);
        return { success: false, error: "Failed to assign job" };
    }
}
