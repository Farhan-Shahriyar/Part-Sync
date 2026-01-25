'use server'

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function restockInventory(partId: number, quantity: number, unitCost: number) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Get Supplier from Part
        const partRes = await client.query("SELECT supplier_id FROM parts WHERE part_id = $1", [partId]);
        const supplierId = partRes.rows[0]?.supplier_id;

        if (!supplierId) {
            throw new Error("Part does not have a linked supplier.");
        }

        // 2. Create Purchase Order
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
