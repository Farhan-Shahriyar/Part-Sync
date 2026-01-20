"use client"

import { createVehicle } from "@/app/admin/data-entry/vehicles/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useActionState } from "react";

const initialState = {
    message: '',
};

export function AddVehicleForm({ customers }: { customers: any[] }) {
    async function action(prevState: any, formData: FormData) {
        const res = await createVehicle(formData);
        if (res?.error) return { message: res.error };
        return { message: 'Vehicle created successfully!' };
    }
    const [state, formAction] = useActionState(action, initialState);

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Vehicle</CardTitle>
                    <CardDescription>Register a vehicle for an existing customer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="customerId">Owner (Customer)</Label>
                            <select
                                name="customerId"
                                id="customerId"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value="" className="bg-background">Select Customer</option>
                                {customers.map((c) => (
                                    <option key={c.customer_id} value={c.customer_id} className="bg-background">
                                        {c.first_name} {c.last_name} ({c.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="make">Make</Label>
                                <Input id="make" name="make" required className="" placeholder="e.g. Toyota" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model">Model</Label>
                                <Input id="model" name="model" required className="" placeholder="e.g. Camry" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input id="year" name="year" type="number" required className="" placeholder="2023" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" name="color" className="" placeholder="Silver" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vin">VIN</Label>
                            <Input id="vin" name="vin" required className="" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="licensePlate">License Plate</Label>
                            <Input id="licensePlate" name="licensePlate" required className="" />
                        </div>

                        {state?.message && (
                            <p className={`text-sm ${state.message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                {state.message}
                            </p>
                        )}

                        <Button type="submit">Create Vehicle</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
