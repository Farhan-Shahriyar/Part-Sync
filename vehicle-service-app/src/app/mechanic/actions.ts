'use server'

import { query } from "@/lib/db"; // Fixed import
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function startJob(jobId: number) {
    try {
        await pool.query(
            "UPDATE service_jobs SET status = 'IN_PROGRESS' WHERE job_id = $1",
            [jobId]
        );
        revalidatePath("/mechanic");
        return { success: true };
    } catch (error) {
        console.error("Failed to start job:", error);
        return { success: false, error: "Failed to start job" };
    }
}

export async function completeJob(jobId: number, serviceTypeId: number) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Update Job Status
        await client.query(
            "UPDATE service_jobs SET status = 'COMPLETED', actual_labor_hours = 1.0 WHERE job_id = $1", // simplified hours
            [jobId]
        );

        // 2. Get Requirements
        const requirementsRes = await client.query(
            "SELECT part_id, quantity FROM service_requirements WHERE service_type_id = $1",
            [serviceTypeId]
        );

        // 3. Deduct Inventory and Record Usage
        for (const req of requirementsRes.rows) {
            // Check stock
            const stockRes = await client.query(
                "SELECT quantity_on_hand, unit_price FROM inventory i JOIN parts p ON i.part_id = p.part_id WHERE i.part_id = $1",
                [req.part_id]
            );

            if (stockRes.rowCount === 0) throw new Error(`Part ${req.part_id} not found in inventory`);
            const stock = stockRes.rows[0];

            if (stock.quantity_on_hand < req.quantity) {
                throw new Error(`Insufficient stock for part ${req.part_id}`);
            }

            // Update Inventory
            await client.query(
                "UPDATE inventory SET quantity_on_hand = quantity_on_hand - $1 WHERE part_id = $2",
                [req.quantity, req.part_id]
            );

            // Record Usage
            await client.query(
                "INSERT INTO parts_used (job_id, part_id, quantity, unit_price_at_time) VALUES ($1, $2, $3, $4)",
                [jobId, req.part_id, req.quantity, stock.unit_price]
            );
        }

        await client.query("COMMIT");
        revalidatePath("/mechanic");
        return { success: true };
    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Failed to complete job:", error);
        return { success: false, error: error.message || "Failed to complete job" };
    } finally {
        client.release();
    }
}
