"use client"

import { createMechanic } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useActionState } from "react";

const initialState = {
    message: '',
};

export default function AddMechanicPage() {
    async function action(prevState: any, formData: FormData) {
        const res = await createMechanic(formData);
        if (res?.error) return { message: res.error };
        return { message: 'Mechanic onboarded successfully!' };
    }
    const [state, formAction] = useActionState(action, initialState);

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Onboard Mechanic</CardTitle>
                    <CardDescription>Create a system user and mechanic profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">

                        <div className="space-y-2 pb-4 border-b border-white/10 mb-4">
                            <h3 className="font-semibold text-white mb-2">User Account</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" name="username" required className="text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required className="text-white" />
                                </div>
                            </div>
                        </div>

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
                            <Label htmlFor="specialty">Specialty</Label>
                            <Input id="specialty" name="specialty" className="text-white" placeholder="e.g. Engines, Electronics" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                            <Input id="hourlyRate" name="hourlyRate" type="number" step="0.01" required className="text-white" />
                        </div>

                        {state?.message && (
                            <p className={`text-sm ${state.message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                {state.message}
                            </p>
                        )}

                        <Button type="submit">Create Mechanic</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
