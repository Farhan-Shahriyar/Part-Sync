'use server';

import { cookies } from 'next/headers';
import { query } from './db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { encrypt, decrypt } from './session';

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Verify credentials against DB
    const result = await query(
        'SELECT user_id, username, password_hash, role FROM users WHERE username = $1',
        [username]
    );

    const user = result.rows[0];

    if (!user) {
        return { error: 'Invalid username or password' };
    }

    let isValid = false;
    if (user.password_hash.startsWith('$2')) {
        isValid = await bcrypt.compare(password, user.password_hash);
    } else {
        isValid = user.password_hash === password;
    }

    if (!isValid) {
        return { error: 'Invalid username or password' };
    }

    // Create session
    const session = await encrypt({
        user_id: user.user_id,
        username: user.username,
        role: user.role
    });

    // Set cookie
    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        path: '/',
    });

    // Redirect based on role
    if (user.role === 'ADMIN') {
        redirect('/admin/dashboard');
    } else if (user.role === 'MECHANIC') {
        redirect('/mechanic');
    } else if (user.role === 'CUSTOMER') {
        redirect('/customer/dashboard');
    } else {
        redirect('/');
    }
}

export async function logout() {
    (await cookies()).set('session', '', { expires: new Date(0) });
    redirect('/login');
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}
