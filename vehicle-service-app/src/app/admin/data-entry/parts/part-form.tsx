"use client"

import { createPart } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useActionState } from "react";

const initialState = {
    message: '',
};

export function AddPartForm({ suppliers, serviceTypes }: { suppliers: any[], serviceTypes: any[] }) {
    async function action(prevState: any, formData: FormData) {
        const res = await createPart(formData);
        if (res?.error) return { message: res.error };
        return { message: 'Part created successfully!' };
    }
    const [state, formAction] = useActionState(action, initialState);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Part</CardTitle>
                <CardDescription>Register a new spare part and link it to a supplier and services.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="partNumber">Part Number</Label>
                            <Input id="partNumber" name="partNumber" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Part Name</Label>
                            <Input id="name" name="name" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="supplierId">Supplier</Label>
                            <select
                                id="supplierId"
                                name="supplierId"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled selected>Select Supplier...</option>
                                {suppliers.map(s => (
                                    <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unitPrice">Unit Price ($)</Label>
                            <Input id="unitPrice" name="unitPrice" type="number" step="0.01" required />
                        </div>
                    </div>

                    <div className="space-y-2 border p-3 rounded-md">
                        <Label>Required for Service (Optional)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {serviceTypes.map(st => (
                                <div key={st.service_type_id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`service_${st.service_type_id}`}
                                        name="serviceTypeIds"
                                        value={st.service_type_id}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label htmlFor={`service_${st.service_type_id}`} className="text-sm">
                                        {st.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                            Quantity required:
                            <Input
                                name="quantityRequired"
                                type="number"
                                defaultValue="1"
                                className="h-6 w-16 inline-block"
                                min="1"
                            />
                            (Applied to all selected services)
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Initial Stock</Label>
                            <Input id="stock" name="stock" type="number" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reorderLevel">Reorder Level</Label>
                            <Input id="reorderLevel" name="reorderLevel" type="number" defaultValue="10" />
                        </div>
                    </div>

                    {state?.message && (
                        <p className={`text-sm ${state.message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                            {state.message}
                        </p>
                    )}

                    <Button type="submit">Create Part</Button>
                </form>
            </CardContent>
        </Card>
    );
}
