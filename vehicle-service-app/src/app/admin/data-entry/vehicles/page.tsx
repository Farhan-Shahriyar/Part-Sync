import { getCustomers } from "@/lib/queries";
import { AddVehicleForm } from "@/components/admin/add-vehicle-form";

export const dynamic = 'force-dynamic';

export default async function AddVehiclePage() {
    const customers = await getCustomers();
    return <AddVehicleForm customers={customers} />;
}
