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
            <Button className="gap-2 bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-wider uppercase rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all h-10 px-6" onClick={() => setOpen(true)}>
                <PlusCircle className="w-4 h-4" />
                Add Vehicle
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px] glass border border-white/10 bg-black/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-light text-white tracking-wide">Add New <span className="font-semibold text-primary">Vehicle</span></DialogTitle>
                        <DialogDescription className="text-zinc-400 font-light">
                            Enter your vehicle details below to register it for service.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vin" className="text-right text-zinc-300">VIN</Label>
                            <Input id="vin" value={formData.vin} onChange={handleChange} className="col-span-3 bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="make" className="text-right text-zinc-300">Make</Label>
                            <Input id="make" value={formData.make} onChange={handleChange} className="col-span-3 bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" placeholder="e.g. Mercedes-Benz" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="model" className="text-right text-zinc-300">Model</Label>
                            <Input id="model" value={formData.model} onChange={handleChange} className="col-span-3 bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" placeholder="e.g. S-Class" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="year" className="text-right text-zinc-300">Year</Label>
                            <Input id="year" type="number" value={formData.year} onChange={handleChange} className="col-span-3 bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="licensePlate" className="text-right text-zinc-300">License</Label>
                            <Input id="licensePlate" value={formData.licensePlate} onChange={handleChange} className="col-span-3 bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600 uppercase" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="color" className="text-right text-zinc-300">Color</Label>
                            <Input id="color" value={formData.color} onChange={handleChange} className="col-span-3 bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" placeholder="e.g. Obsidian Black" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all w-full md:w-auto" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'ADDING...' : 'ADD VEHICLE'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
