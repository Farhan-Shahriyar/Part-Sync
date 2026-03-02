"use client"

import { useState } from "react"
import { createBooking, fetchVehiclesAction } from "@/app/customer/book/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Car, Wrench } from "lucide-react"

export function BookingForm({ vehicles, serviceTypes, customerId }: { vehicles: any[], serviceTypes: any[], customerId: number }) {

    return (
        <Card className="max-w-xl mx-auto glass border-white/5 bg-black/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="pb-6 border-b border-white/5">
                <CardTitle className="text-2xl font-light text-white tracking-wide">Booking Details</CardTitle>
                <CardDescription className="text-zinc-500 font-light">Select your vehicle and required services.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={async (formData) => {
                    formData.append('customerId', customerId.toString());
                    await createBooking(formData);
                }} className="space-y-8">

                    <div className="space-y-3">
                        <Label htmlFor="vehicleId" className="flex items-center justify-between text-zinc-300">
                            <span className="flex items-center gap-2"><Car className="w-4 h-4 text-primary" /> Vehicle</span>
                            <a href="/customer/vehicles/add" className="text-[10px] uppercase tracking-widest text-primary hover:text-white transition-colors border-b border-primary/30 pb-0.5">Add New</a>
                        </Label>
                        <select
                            name="vehicleId"
                            id="vehicleId"
                            className="flex h-12 w-full rounded border border-white/10 bg-black/50 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-white transition-colors"
                            required
                        >
                            <option value="" className="bg-zinc-900">Select Vehicle</option>
                            {vehicles.map((v) => (
                                <option key={v.vehicle_id} value={v.vehicle_id} className="bg-zinc-900">
                                    {v.year} {v.make} {v.model} - {v.license_plate}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-zinc-300 flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-primary" /> Service Options
                        </Label>
                        <div className="grid gap-3 p-5 rounded border border-white/5 bg-white/5 max-h-[250px] overflow-y-auto custom-scrollbar">
                            {serviceTypes.map((s) => (
                                <div key={s.service_type_id} className="flex items-start space-x-3 group">
                                    <input
                                        type="checkbox"
                                        id={`service-${s.service_type_id}`}
                                        name="serviceTypeIds"
                                        value={s.service_type_id}
                                        className="h-4 w-4 mt-0.5 rounded border-white/10 bg-black/50 text-primary focus:ring-1 focus:ring-primary accent-primary cursor-pointer"
                                    />
                                    <label
                                        htmlFor={`service-${s.service_type_id}`}
                                        className="text-sm leading-tight text-white group-hover:text-primary transition-colors cursor-pointer"
                                    >
                                        <div className="font-medium tracking-wide">{s.name}</div>
                                        <div className="text-zinc-500 text-xs mt-1">
                                            <span className="text-primary/80">${s.base_labor_cost}</span> &bull; Est. {s.estimated_hours} hrs
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="date" className="flex items-center gap-2 text-zinc-300">
                            <CalendarIcon className="w-4 h-4 text-primary" /> Expected Date
                        </Label>
                        <Input type="datetime-local" name="date" id="date" required className="h-12 border-white/10 bg-black/50 text-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary [color-scheme:dark]" />
                    </div>

                    <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all mt-4">
                        Confirm Appointment
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
