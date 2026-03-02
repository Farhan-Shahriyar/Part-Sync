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
        <div className="min-h-screen bg-background p-8 flex items-center justify-center font-sans selection:bg-primary/30 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="w-full max-w-2xl relative z-10">
                <div className="mb-10 text-center space-y-2">
                    <h1 className="text-4xl font-light tracking-wide text-white uppercase">Schedule <span className="font-semibold text-primary">Service</span></h1>
                    <p className="text-zinc-400 font-light tracking-wide">Request an appointment for maintenance or repairs.</p>
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
