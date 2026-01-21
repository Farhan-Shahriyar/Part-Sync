"use client"

import { useState } from "react"
import { createBooking, fetchVehiclesAction } from "@/app/customer/book/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Car, User } from "lucide-react"

export function BookingForm({ vehicles, serviceTypes, customerId }: { vehicles: any[], serviceTypes: any[], customerId: number }) {

    return (
        <Card className="max-w-xl mx-auto border-orange-500/30 shadow-2xl shadow-orange-900/20">
            <CardHeader>
                <CardTitle className="text-2xl">Book a Service</CardTitle>
                <CardDescription>Select your vehicle and the required service.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={async (formData) => {
                    formData.append('customerId', customerId.toString());
                    await createBooking(formData);
                }} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="vehicleId" className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-primary" /> Vehicle
                        </Label>
                        <select
                            name="vehicleId"
                            id="vehicleId"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                        >
                            <option value="" className="bg-background">Select Vehicle</option>
                            {vehicles.map((v) => (
                                <option key={v.vehicle_id} value={v.vehicle_id} className="bg-background">
                                    {v.year} {v.make} {v.model} - {v.license_plate}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="serviceTypeId">Service Type</Label>
                        <select
                            name="serviceTypeId"
                            id="serviceTypeId"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                        >
                            <option value="" className="bg-background">Select Service</option>
                            {serviceTypes.map((s) => (
                                <option key={s.service_type_id} value={s.service_type_id} className="bg-background">
                                    {s.name} (${s.base_labor_cost})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date" className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-primary" /> Expected Date
                        </Label>
                        <Input type="datetime-local" name="date" id="date" required className="fill-foreground" />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold py-2">
                        Confirm Booking
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
