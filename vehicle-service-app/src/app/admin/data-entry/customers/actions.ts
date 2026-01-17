'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCustomer(formData: FormData) {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');

    try {
        const res = await query(
            `INSERT INTO customers (first_name, last_name, email, phone, address) 
       VALUES ($1, $2, $3, $4, $5) RETURNING customer_id`,
            [firstName, lastName, email, phone, address]
        );
        console.log("Customer created with ID:", res.rows[0].customer_id);
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to create customer: ' + e.message };
    }

    revalidatePath('/admin');
    return { success: true };
}
