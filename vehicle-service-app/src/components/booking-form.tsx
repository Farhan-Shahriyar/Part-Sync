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
                        <Label htmlFor="vehicleId" className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Car className="w-4 h-4 text-primary" /> Vehicle</span>
                            <a href="/customer/vehicles/add" className="text-xs text-primary hover:underline">Add New Vehicle</a>
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

                    <div className="space-y-3">
                        <Label>Service Types</Label>
                        <div className="grid gap-2 p-4 border rounded-md bg-muted/20">
                            {serviceTypes.map((s) => (
                                <div key={s.service_type_id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`service-${s.service_type_id}`}
                                        name="serviceTypeIds"
                                        value={s.service_type_id}
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label
                                        htmlFor={`service-${s.service_type_id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {s.name} - ${s.base_labor_cost} <span className="text-muted-foreground text-xs font-normal">(Est. {s.estimated_hours} hrs)</span>
                                    </label>
                                </div>
                            ))}
                        </div>
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
