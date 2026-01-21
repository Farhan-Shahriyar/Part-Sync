import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const currentUser = session ? await decrypt(session) : null;

    // 1. Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!currentUser || currentUser.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. Mechanic Routes
    if (request.nextUrl.pathname.startsWith('/mechanic')) {
        if (!currentUser || currentUser.role !== 'MECHANIC') {
            // Allow admins to view mechanic portal too? Maybe not for strict separation.
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. Customer Routes
    if (request.nextUrl.pathname.startsWith('/customer')) {
        if (!currentUser || currentUser.role !== 'CUSTOMER') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 4. Redirect logged-in users away from login/register
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
        if (currentUser) {
            if (currentUser.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
            if (currentUser.role === 'MECHANIC') return NextResponse.redirect(new URL('/mechanic', request.url));
            if (currentUser.role === 'CUSTOMER') return NextResponse.redirect(new URL('/customer/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/mechanic/:path*', '/customer/:path*', '/login', '/register'],
};
