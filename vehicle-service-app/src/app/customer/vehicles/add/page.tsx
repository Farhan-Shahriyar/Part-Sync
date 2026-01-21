"use client"

import { addVehicle } from "./actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AddVehiclePage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        return await addVehicle(formData);
    }, null);

    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <Card className="w-full max-w-lg border-orange-500/30 shadow-xl shadow-orange-900/10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                        Add New Vehicle
                    </CardTitle>
                    <CardDescription>
                        Register a vehicle to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="make">Make</Label>
                                <Input id="make" name="make" required placeholder="Toyota" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model">Model</Label>
                                <Input id="model" name="model" required placeholder="Camry" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input id="year" name="year" type="number" required placeholder="2023" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" name="color" placeholder="White" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vin">VIN</Label>
                            <Input id="vin" name="vin" required placeholder="17-character VIN" maxLength={17} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="licensePlate">License Plate</Label>
                            <Input id="licensePlate" name="licensePlate" required placeholder="ABC-1234" />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-500 font-medium">{state.error}</p>
                        )}

                        <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold" disabled={isPending}>
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Add Vehicle"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
