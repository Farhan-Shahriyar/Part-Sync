import { getAllSuppliers, getServiceTypes } from "@/lib/queries";
import { AddPartForm } from "./part-form";

export const dynamic = 'force-dynamic';

export default async function AddPartPage() {
    const suppliers = await getAllSuppliers();
    const serviceTypes = await getServiceTypes();

    return (
        <div className="max-w-2xl mx-auto">
            <AddPartForm suppliers={suppliers} serviceTypes={serviceTypes} />
        </div>
    );
}
