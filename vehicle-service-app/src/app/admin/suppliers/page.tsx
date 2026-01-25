import { getAllSuppliers } from "@/lib/queries";
import { query } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Box } from "lucide-react";
import { AddSupplierDialog } from "./add-supplier-dialog"; // Need to create this

export const dynamic = 'force-dynamic';

async function getSupplierParts(supplierId: number) {
    const res = await query('SELECT * FROM parts WHERE supplier_id = $1', [supplierId]);
    return res.rows;
}

export default async function AdminSuppliersPage() {
    const suppliers = await getAllSuppliers();

    const suppliersWithParts = await Promise.all(suppliers.map(async (s: any) => {
        const parts = await getSupplierParts(s.supplier_id);
        return { ...s, parts };
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Suppliers</h1>
                <AddSupplierDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suppliersWithParts.map((supplier: any) => (
                    <Card key={supplier.supplier_id}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">{supplier.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{supplier.contact_person}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span>{supplier.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span>{supplier.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="border-t pt-2 mt-2">
                                <span className="text-xs text-muted-foreground font-semibold uppercase">Parts Provided</span>
                                <div className="mt-2 space-y-1">
                                    {supplier.parts.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No parts linked.</p>
                                    ) : (
                                        supplier.parts.map((p: any) => (
                                            <div key={p.part_id} className="flex items-center gap-2 text-sm">
                                                <Box className="w-3 h-3 text-primary" />
                                                <span>{p.name}</span>
                                                <span className="text-xs text-muted-foreground">({p.part_number})</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
