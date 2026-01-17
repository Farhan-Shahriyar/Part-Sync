import { getCustomers, getServiceTypes } from "@/lib/queries";
import { BookingForm } from "@/components/booking-form";

export const dynamic = 'force-dynamic';

export default async function BookingPage() {
    const customers = await getCustomers();
    const serviceTypes = await getServiceTypes();

    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <div className="w-full">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">New Service Booking</h1>
                    <p className="text-muted-foreground">Select customer and vehicle to create a job card.</p>
                </div>
                <BookingForm customers={customers} serviceTypes={serviceTypes} />
            </div>
        </div>
    );
}
