'use client';

import { useState } from "react";
import { restockInventory } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Assuming this exists or using previous one
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function RestockDialog({ partId, partName, currentStock, suppliers }: { partId: number, partName: string, currentStock: number, suppliers: any[] }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState("10");
    const [cost, setCost] = useState("0.00");
    const [supplierId, setSupplierId] = useState(suppliers[0]?.supplier_id?.toString() || "");

    const handleRestock = async () => {
        setLoading(true);
        if (!supplierId) {
            alert("Please select a supplier");
            return;
        }
        try {
            const res = await restockInventory(partId, parseInt(quantity), parseFloat(cost), parseInt(supplierId));
            if (res.success) {
                setOpen(false);
                setQuantity("10");
                setCost("0.00");
            } else {
                alert(res.error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button size="sm" variant="outline" className="gap-1" onClick={() => setOpen(true)}>
                <Plus className="w-3 h-3" /> Restock
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Restock {partName}</DialogTitle>
                        <DialogDescription>
                            Add new stock. Current level: {currentStock}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="supplier" className="text-right">
                                Supplier
                            </Label>
                            <select
                                id="supplier"
                                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={supplierId}
                                onChange={(e) => setSupplierId(e.target.value)}
                            >
                                <option value="" disabled>Select Supplier...</option>
                                {suppliers.map(s => (
                                    <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                                Quantity
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cost" className="text-right">
                                Unit Cost ($)
                            </Label>
                            <Input
                                id="cost"
                                type="number"
                                step="0.01"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleRestock} disabled={loading}>
                            {loading ? 'Restocking...' : 'Confirm Restock'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
