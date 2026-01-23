'use server'

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function restockInventory(partId: number, quantity: number, unitCost: number) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Create Purchase Order (Automatic for Restock)
        // Check if there is an 'Internal Restock' supplier or just use first one/dummy for now as requirement didn't specify supplier selection
        // For simplicity, we'll pick the first available supplier or create a generic one if needed.
        // Or better, let's assume we order from the first supplier found for now.
        const supplierRes = await client.query("SELECT supplier_id FROM suppliers LIMIT 1");
        const supplierId = supplierRes.rows[0]?.supplier_id;

        if (!supplierId) {
            throw new Error("No suppliers defined in system.");
        }

        const poRes = await client.query(
            "INSERT INTO purchase_orders (supplier_id, order_date, status, total_amount) VALUES ($1, NOW(), 'RECEIVED', $2) RETURNING po_id",
            [supplierId, quantity * unitCost]
        );
        const poId = poRes.rows[0].po_id;

        // 2. Add Item to PO
        await client.query(
            "INSERT INTO po_items (po_id, part_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
            [poId, partId, quantity, unitCost]
        );

        // 3. Update Inventory
        await client.query(
            "UPDATE inventory SET quantity_on_hand = quantity_on_hand + $1, last_restocked_at = NOW() WHERE part_id = $2",
            [quantity, partId]
        );

        await client.query("COMMIT");
        revalidatePath("/admin/inventory");
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Failed to restock:", error);
        return { success: false, error: error.message || "Failed to restock" };
    } finally {
        client.release();
    }
}
