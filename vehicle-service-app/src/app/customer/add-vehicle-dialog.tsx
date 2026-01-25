'use client';

import { useState } from "react";
import { addVehicle } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export function AddVehicleDialog({ customerId }: { customerId: number }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vin: "",
        make: "",
        model: "",
        year: new Date().getFullYear().toString(),
        licensePlate: "",
        color: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await addVehicle(customerId, formData);
            if (res.success) {
                setOpen(false);
                setFormData({
                    vin: "",
                    make: "",
                    model: "",
                    year: new Date().getFullYear().toString(),
                    licensePlate: "",
                    color: ""
                });
            } else {
                alert(res.error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button className="gap-2" onClick={() => setOpen(true)}>
                <PlusCircle className="w-4 h-4" />
                Add Vehicle
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Vehicle</DialogTitle>
                        <DialogDescription>
                            Enter your vehicle details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vin" className="text-right">VIN</Label>
                            <Input id="vin" value={formData.vin} onChange={handleChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="make" className="text-right">Make</Label>
                            <Input id="make" value={formData.make} onChange={handleChange} className="col-span-3" placeholder="e.g. Toyota" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="model" className="text-right">Model</Label>
                            <Input id="model" value={formData.model} onChange={handleChange} className="col-span-3" placeholder="e.g. Camry" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="year" className="text-right">Year</Label>
                            <Input id="year" type="number" value={formData.year} onChange={handleChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="licensePlate" className="text-right">License</Label>
                            <Input id="licensePlate" value={formData.licensePlate} onChange={handleChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="color" className="text-right">Color</Label>
                            <Input id="color" value={formData.color} onChange={handleChange} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Adding...' : 'Add Vehicle'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
