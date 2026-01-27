'use server'

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function restockInventory(partId: number, quantity: number) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Get Supplier & Price from Part
        const partRes = await client.query("SELECT supplier_id, unit_price FROM parts WHERE part_id = $1", [partId]);
        const part = partRes.rows[0];

        if (!part?.supplier_id) {
            throw new Error("Part does not have a linked supplier.");
        }

        // Use Part's Unit Price as the Cost (as requested fixed price)
        const unitCost = part.unit_price;

        // 2. Create Purchase Order
        const poRes = await client.query(
            "INSERT INTO purchase_orders (supplier_id, order_date, status, total_amount) VALUES ($1, NOW(), 'RECEIVED', $2) RETURNING po_id",
            [part.supplier_id, quantity * unitCost]
        );
        const poId = poRes.rows[0].po_id;

        // 3. Add Item to PO (Fixing column name to unit_cost)
        await client.query(
            "INSERT INTO po_items (po_id, part_id, quantity, unit_cost) VALUES ($1, $2, $3, $4)",
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
