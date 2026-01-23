import { getAllInventory } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle, Package } from "lucide-react";
import Link from "next/link";
import { RestockDialog } from "./restock-dialog";

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
    const inventory = await getAllInventory();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <Link href="/admin/data-entry/parts">
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Add Part
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item: any) => {
                    const isLowStock = item.quantity_on_hand <= item.reorder_level;
                    return (
                        <Card key={item.inventory_id} className={isLowStock ? "border-l-4 border-l-red-500" : ""}>
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div>
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{item.part_number}</p>
                                </div>
                                <div className="flex gap-2">
                                    {isLowStock && (
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    )}
                                    <RestockDialog
                                        partId={item.part_id}
                                        partName={item.name}
                                        currentStock={item.quantity_on_hand}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center bg-muted p-2 rounded">
                                    <span className="text-sm text-muted-foreground">In Stock</span>
                                    <span className={`text-lg font-bold ${isLowStock ? "text-red-500" : ""}`}>
                                        {item.quantity_on_hand}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Reorder Level:</span>
                                    <span>{item.reorder_level}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Unit Price:</span>
                                    <span>${item.unit_price}</span>
                                </div>
                                <div className="text-xs text-muted-foreground pt-2 border-t">
                                    Manufacturer: {item.manufacturer || 'N/A'}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
