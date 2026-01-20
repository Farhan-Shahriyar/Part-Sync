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

export default function AddPartPage() {
    async function action(prevState: any, formData: FormData) {
        const res = await createPart(formData);
        if (res?.error) return { message: res.error };
        return { message: 'Part created successfully!' };
    }
    const [state, formAction] = useActionState(action, initialState);

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Part</CardTitle>
                    <CardDescription>Register a new spare part and its initial stock.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="partNumber">Part Number</Label>
                                <Input id="partNumber" name="partNumber" required className="" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Part Name</Label>
                                <Input id="name" name="name" required className="" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" className="" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manufacturer">Manufacturer</Label>
                                <Input id="manufacturer" name="manufacturer" className="" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unitPrice">Unit Price ($)</Label>
                                <Input id="unitPrice" name="unitPrice" type="number" step="0.01" required className="" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div className="space-y-2">
                                <Label htmlFor="stock">Initial Stock</Label>
                                <Input id="stock" name="stock" type="number" defaultValue="0" className="" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reorderLevel">Reorder Level</Label>
                                <Input id="reorderLevel" name="reorderLevel" type="number" defaultValue="10" className="" />
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
        </div>
    );
}
