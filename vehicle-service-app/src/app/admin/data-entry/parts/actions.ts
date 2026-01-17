'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPart(formData: FormData) {
    const partNumber = formData.get('partNumber');
    const name = formData.get('name');
    const description = formData.get('description');
    const manufacturer = formData.get('manufacturer');
    const unitPrice = formData.get('unitPrice');
    const stock = formData.get('stock'); // Optional initial stock
    const reorderLevel = formData.get('reorderLevel');

    try {
        // Transaction-like logic (though using simple queries here for demo, better to use BEGIN/COMMIT for production)
        // 1. Insert Part
        const partRes = await query(
            `INSERT INTO parts (part_number, name, description, manufacturer, unit_price) 
       VALUES ($1, $2, $3, $4, $5) RETURNING part_id`,
            [partNumber, name, description, manufacturer, unitPrice]
        );

        const partId = partRes.rows[0].part_id;

        // 2. Insert Initial Inventory
        if (stock) {
            await query(
                `INSERT INTO inventory (part_id, quantity_on_hand, reorder_level)
             VALUES ($1, $2, $3)`,
                [partId, stock, reorderLevel || 10]
            );
        }
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to create part: ' + e.message };
    }

    revalidatePath('/admin');
    return { success: true };
}
