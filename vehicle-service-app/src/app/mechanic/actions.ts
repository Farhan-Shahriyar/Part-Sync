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

        // 1. Get Job Info (Mechanic Rate) and labor hours (assuming 1 hour if not set)
        const jobRes = await client.query(`
            SELECT sj.order_id, m.hourly_rate 
            FROM service_jobs sj 
            LEFT JOIN mechanics m ON sj.mechanic_id = m.mechanic_id 
            WHERE sj.job_id = $1
        `, [jobId]);
        const { order_id, hourly_rate } = jobRes.rows[0];
        const laborCost = parseFloat(hourly_rate || 0) * 1.0; // Defaulting to 1 hour for MVP

        // 2. Update Job Status & Cost
        await client.query(
            "UPDATE service_jobs SET status = 'COMPLETED', actual_labor_hours = 1.0, labor_cost = $2 WHERE job_id = $1",
            [jobId, laborCost]
        );

        // 3. Get Requirements & Calculate Parts Cost
        const requirementsRes = await client.query(
            "SELECT part_id, quantity FROM service_requirements WHERE service_type_id = $1",
            [serviceTypeId]
        );

        let partsCost = 0;

        // 4. Deduct Inventory and Record Usage
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

            partsCost += parseFloat(stock.unit_price) * req.quantity;

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

        // 5. Update Order Total Amount
        await client.query(
            "UPDATE service_orders SET total_amount = COALESCE(total_amount, 0) + $1 WHERE order_id = $2",
            [laborCost + partsCost, order_id]
        );

        // 6. Check if all jobs in this order are completed
        const pendingJobsRes = await client.query(
            "SELECT COUNT(*) as count FROM service_jobs WHERE order_id = $1 AND status != 'COMPLETED'",
            [order_id]
        );

        if (parseInt(pendingJobsRes.rows[0].count) === 0) {
            await client.query(
                "UPDATE service_orders SET status = 'COMPLETED' WHERE order_id = $1",
                [order_id]
            );
        }

        await client.query("COMMIT");
        revalidatePath("/mechanic");
        revalidatePath("/admin/orders"); // Revalidate admin orders too
        return { success: true };
    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Failed to complete job:", error);
        return { success: false, error: error.message || "Failed to complete job" };
    } finally {
        client.release();
    }
}
