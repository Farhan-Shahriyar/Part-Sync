import { getAllMechanics } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminMechanicsPage() {
    const mechanics = await getAllMechanics();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Mechanics</h1>
                <Link href="/admin/data-entry/mechanics">
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Add Mechanic
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mechanics.map((mechanic: any) => (
                    <Card key={mechanic.mechanic_id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                                {mechanic.first_name[0]}{mechanic.last_name[0]}
                            </div>
                            <div>
                                <CardTitle>{mechanic.first_name} {mechanic.last_name}</CardTitle>
                                <p className="text-sm text-muted-foreground">@{mechanic.username || 'unknown'}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Specialty:</span>
                                <span className="font-medium">{mechanic.specialty || 'General'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Rate:</span>
                                <span className="font-medium">${mechanic.hourly_rate}/hr</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`font-medium ${mechanic.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                    {mechanic.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
