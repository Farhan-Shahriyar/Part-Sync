"use client"

import { createCustomer } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useActionState } from "react";

const initialState = {
    message: '',
};

export default function AddCustomerPage() {
    async function action(prevState: any, formData: FormData) {
        const res = await createCustomer(formData);
        if (res?.error) return { message: res.error };
        return { message: 'Customer created successfully!' };
    }
    const [state, formAction] = useActionState(action, initialState);

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Customer</CardTitle>
                    <CardDescription>Enter customer details to register them in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" required className="text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" required className="text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required className="text-white" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" required className="text-white" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" className="text-white" />
                        </div>

                        {state?.message && (
                            <p className={`text-sm ${state.message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                {state.message}
                            </p>
                        )}

                        <Button type="submit">Create Customer</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
