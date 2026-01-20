"use client"

import { useState } from "react"
import { createBooking, fetchVehiclesAction } from "@/app/customer/book/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Car, User } from "lucide-react"

export function BookingForm({ customers, serviceTypes }: { customers: any[], serviceTypes: any[] }) {
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loadingVehicles, setLoadingVehicles] = useState(false)

    const handleCustomerChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const custId = parseInt(e.target.value);
        if (!custId) {
            setVehicles([]);
            return;
        }
        setLoadingVehicles(true);
        const ves = await fetchVehiclesAction(custId);
        setVehicles(ves);
        setLoadingVehicles(false);
    }

    return (
        <Card className="max-w-xl mx-auto border-orange-500/30 shadow-2xl shadow-orange-900/20">
            <CardHeader>
                <CardTitle className="text-2xl">Book a Service</CardTitle>
                <CardDescription>Schedule a new service appointment.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={async (formData) => {
                    await createBooking(formData);
                }} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="customerId" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" /> Customer
                        </Label>
                        <select
                            name="customerId"
                            id="customerId"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            onChange={handleCustomerChange}
                            required
                        >
                            <option value="" className="bg-background">Select Customer</option>
                            {customers.map((c) => (
                                <option key={c.customer_id} value={c.customer_id} className="bg-background">
                                    {c.first_name} {c.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vehicleId" className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-primary" /> Vehicle
                        </Label>
                        <select
                            name="vehicleId"
                            id="vehicleId"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none disabled:opacity-50"
                            disabled={loadingVehicles || vehicles.length === 0}
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
