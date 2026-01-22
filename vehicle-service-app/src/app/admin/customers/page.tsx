import { getAllCustomers } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Phone, Mail, MapPin, Car } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
    const customers = await getAllCustomers();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Customers</h1>
                <Link href="/admin/data-entry/customers">
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Add Customer
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {customers.map((customer: any) => (
                    <Card key={customer.customer_id}>
                        <CardHeader>
                            <CardTitle>{customer.first_name} {customer.last_name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{customer.address}</span>
                            </div>
                            <div className="pt-2 border-t flex items-center gap-2 text-sm font-medium">
                                <Car className="w-4 h-4 text-primary" />
                                <span>{customer.vehicle_count} Vehicles</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
