'use server';

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleAutoRestock(partId: number, autoRestock: boolean) {
    try {
        await query(
            "UPDATE inventory SET auto_restock = $1 WHERE part_id = $2",
            [autoRestock, partId]
        );
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (e) {
        console.error("Failed to toggle auto restock", e);
        return { success: false, error: 'Failed to update auto_restock flag' };
    }
}
