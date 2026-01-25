'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addSupplier(data: any) {
    try {
        await query(
            "INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES ($1, $2, $3, $4, $5)",
            [data.name, data.contactPerson, data.phone, data.email, data.address]
        );
        revalidatePath("/admin/suppliers");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to add supplier:", error);
        return { success: false, error: error.message || "Failed to add supplier" };
    }
}
