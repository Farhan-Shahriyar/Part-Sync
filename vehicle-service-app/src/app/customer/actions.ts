'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addVehicle(customerId: number, data: any) {
    try {
        await query(
            "INSERT INTO vehicles (customer_id, vin, make, model, year, license_plate, color) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [customerId, data.vin, data.make, data.model, parseInt(data.year), data.licensePlate, data.color]
        );
        revalidatePath("/customer/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to add vehicle:", error);
        return { success: false, error: error.message || "Failed to add vehicle" };
    }
}
