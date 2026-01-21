import { getServiceTypes, getCustomerStats } from "@/lib/queries";
import { BookingForm } from "@/components/booking-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function BookingPage() {
    const session = await getSession();
    if (!session || session.role !== 'CUSTOMER') {
        redirect('/login');
    }

    const serviceTypes = await getServiceTypes();
    const stats = await getCustomerStats(session.user_id);

    if (!stats) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <div className="w-full">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">New Service Booking</h1>
                    <p className="text-muted-foreground">Schedule a service for one of your vehicles.</p>
                </div>
                <BookingForm
                    vehicles={stats.vehicles}
                    serviceTypes={serviceTypes}
                    customerId={stats.customer.customer_id}
                />
            </div>
        </div>
    );
}
