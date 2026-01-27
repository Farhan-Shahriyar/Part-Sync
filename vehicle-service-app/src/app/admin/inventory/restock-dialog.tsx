'use client';

import { useState } from "react";
import { restockInventory } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Assuming this exists or using previous one
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function RestockDialog({ partId, partName, currentStock, unitPrice }: { partId: number, partName: string, currentStock: number, unitPrice: number }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState("10");

    const handleRestock = async () => {
        setLoading(true);
        try {
            const res = await restockInventory(partId, parseInt(quantity));
            if (res.success) {
                setOpen(false);
                setQuantity("10");
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
                            <br />
                            <span className="text-xs text-muted-foreground">Supplier will be automatically selected from part record.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                                value={unitPrice}
                                disabled
                                className="col-span-3 bg-muted"
                                title="Fixed based on Part Price"
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
