'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createVehicle(formData: FormData) {
    const customerId = formData.get('customerId');
    const vin = formData.get('vin');
    const make = formData.get('make');
    const model = formData.get('model');
    const year = formData.get('year');
    const licensePlate = formData.get('licensePlate');
    const color = formData.get('color');

    try {
        await query(
            `INSERT INTO vehicles (customer_id, vin, make, model, year, license_plate, color) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, vin, make, model, year, licensePlate, color]
        );
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to create vehicle: ' + e.message };
    }

    revalidatePath('/admin');
    return { success: true };
}
