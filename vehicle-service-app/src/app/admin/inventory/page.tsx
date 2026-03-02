import { getAllInventory, getAllSuppliers } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle, Package } from "lucide-react";
import Link from "next/link";
import { RestockDialog } from "./restock-dialog";
import { AutoRestockSwitch } from "./auto-restock-switch";

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
    const inventory = await getAllInventory();
    const suppliers = await getAllSuppliers();

    return (
        <div className="p-2 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/20 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl font-light tracking-wide text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-primary" />
                        Parts <span className="font-semibold text-primary">Inventory</span>
                    </h1>
                    <p className="text-zinc-400 font-light mt-1">Manage stock levels, reorder thresholds, and automated logistics.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/data-entry/inventory">
                        <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-wider uppercase rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all">
                            <PlusCircle className="mr-2 h-4 w-4" /> Receive Stock
                        </Button>
                    </Link>
                    <Link href="/admin/data-entry/parts">
                        <Button variant="outline" className="border-white/10 hover:border-primary/50 hover:bg-white/5 text-zinc-300 rounded-sm uppercase tracking-wider text-xs font-bold transition-all">
                            <PlusCircle className="mr-2 h-4 w-4" /> New Part Type
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inventory.map((item: any) => {
                    const isLowStock = item.quantity_on_hand <= item.reorder_level;
                    return (
                        <Card key={item.part_id} className={`glass overflow-hidden border-white/5 transition-all hover:bg-white/5 ${isLowStock ? "border-l-4 border-l-red-500" : "border-l-4 border-l-primary/50"} bg-black/40`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                            <Package className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-white font-medium">{item.name}</CardTitle>
                                            <p className="text-xs font-mono text-zinc-500">{item.part_number}</p>
                                        </div>
                                    </div>
                                    {isLowStock && (
                                        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                                    <span className="text-sm text-zinc-400 font-light">Available Quantity</span>
                                    <span className={`text-xl font-light ${isLowStock ? "text-red-500" : "text-white"}`}>
                                        {item.quantity_on_hand}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500 font-light">Restock Threshold:</span>
                                        <span className="text-zinc-300 font-mono">{item.reorder_level}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500 font-light">Acquisition Cost:</span>
                                        <span className="text-primary font-medium tracking-wider">${item.unit_price}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5 mt-2">
                                    <span className="text-zinc-400 font-light text-xs uppercase tracking-widest">Automated Logistics:</span>
                                    <AutoRestockSwitch partId={item.part_id} initialState={item.auto_restock || false} />
                                </div>
                                <div className="text-[10px] text-zinc-600 uppercase tracking-widest pt-3 border-t border-white/5 mt-2">
                                    OEM: {item.manufacturer || 'Unspecified'}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
