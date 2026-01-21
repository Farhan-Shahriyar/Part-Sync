'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getVehicles } from "@/lib/queries";

export async function fetchVehiclesAction(customerId: number) {
    return await getVehicles(customerId);
}

import { getSession } from "@/lib/auth";

export async function createBooking(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'CUSTOMER') {
        redirect('/login');
    }

    const customerId = formData.get('customerId');

    // Verify session user owns this customer profile
    const custRes = await query('SELECT user_id FROM customers WHERE customer_id = $1', [customerId]);
    if (custRes.rows[0].user_id !== session.user_id) {
        return { error: 'Unauthorized booking attempt' };
    }

    const vehicleId = formData.get('vehicleId');
    const serviceTypeId = formData.get('serviceTypeId');
    const date = formData.get('date');

    // Call the stored procedure
    // Note: Procedures are called with CALL. INOUT params are tricky in node-postgres simple query. 
    // We can use a transaction block or just a simple call if we don't need the return value immediately for logic in SQL, 
    // but we want the order_id.
    // The procedure `sp_create_booking` has an INOUT parameter.
    // In pg-node, accessing INOUT values from CALL is supported by inspecting rows.

    // Syntax: CALL sp_create_booking($1, $2, $3, $4, NULL)
    // The last NULL is for the INOUT p_new_order_id, which will be returned.

    try {
        const result = await query(
            'CALL sp_create_booking($1::int, $2::int, $3::int, $4::timestamptz, NULL)',
            [customerId, vehicleId, serviceTypeId, date]
        );

        // After CALL, the result usually contains the INOUT param as a row if supported, 
        // or we might need to select it.
        // Let's assume for this MVP we just redirect on success.

        console.log("Booking created", result);
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create booking' };
    }

    revalidatePath('/customer/dashboard');
    redirect('/customer/dashboard');
}
