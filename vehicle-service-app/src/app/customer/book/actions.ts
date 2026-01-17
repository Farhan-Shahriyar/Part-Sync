'use server'

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getVehicles } from "@/lib/queries";

export async function fetchVehiclesAction(customerId: number) {
    return await getVehicles(customerId);
}

export async function createBooking(formData: FormData) {
    const customerId = formData.get('customerId');
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

    revalidatePath('/');
    redirect('/');
}
