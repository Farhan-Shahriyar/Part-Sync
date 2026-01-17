'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createMechanic(formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password'); // In real app, hash this!
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const specialty = formData.get('specialty');
    const hourlyRate = formData.get('hourlyRate');

    try {
        // 1. Create User
        const userRes = await query(
            `INSERT INTO users (username, password_hash, role) 
       VALUES ($1, $2, 'MECHANIC') RETURNING user_id`,
            [username, password]
        );
        const userId = userRes.rows[0].user_id;

        // 2. Create Mechanic Profile
        await query(
            `INSERT INTO mechanics (user_id, first_name, last_name, specialty, hourly_rate)
       VALUES ($1, $2, $3, $4, $5)`,
            [userId, firstName, lastName, specialty, hourlyRate]
        );
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to create mechanic: ' + e.message };
    }

    revalidatePath('/admin');
    return { success: true };
}
