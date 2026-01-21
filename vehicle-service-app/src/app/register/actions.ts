'use server'

import { query } from "@/lib/db";
import { login } from "@/lib/auth";

export async function registerCustomer(formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Ideally use a transaction here, but simple pool query execution is fine for MVP
    try {
        // 1. Create User
        // Note: Password should be hashed in production using bcrypt 
        // const hashedPassword = await bcrypt.hash(password, 10);
        // Using plaintext for demo consistency with seed data not all being hashed properly yet
        const userRes = await query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING user_id',
            [username, password, 'CUSTOMER']
        );
        const userId = userRes.rows[0].user_id;

        // 2. Create Customer Profile
        await query(
            'INSERT INTO customers (user_id, first_name, last_name, email, phone) VALUES ($1, $2, $3, $4, $5)',
            [userId, firstName, lastName, email, phone]
        );

    } catch (e: any) {
        console.error(e);
        if (e.code === '23505') { // Unique violation
            if (e.constraint?.includes('users_username_key')) return { error: 'Username already taken' };
            if (e.constraint?.includes('customers_email_key')) return { error: 'Email already registered' };
        }
        return { error: 'Registration failed. Please try again.' };
    }

    // Auto login
    return await login(formData);
}
