'use server'

import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addVehicle(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'CUSTOMER') {
        redirect('/login');
    }

    // Get customer ID
    const custRes = await query('SELECT customer_id FROM customers WHERE user_id = $1', [session.user_id]);
    const customerId = custRes.rows[0]?.customer_id;

    if (!customerId) return { error: 'Customer profile not found' };

    const make = formData.get('make');
    const model = formData.get('model');
    const year = formData.get('year');
    const vin = formData.get('vin');
    const licensePlate = formData.get('licensePlate');
    const color = formData.get('color');

    try {
        await query(
            'INSERT INTO vehicles (customer_id, vin, make, model, year, license_plate, color) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [customerId, vin, make, model, year, licensePlate, color]
        );
    } catch (e: any) {
        console.error(e);
        if (e.code === '23505') return { error: 'VIN or License Plate already exists' };
        return { error: 'Failed to add vehicle' };
    }

    revalidatePath('/customer/dashboard');
    redirect('/customer/dashboard');
}
