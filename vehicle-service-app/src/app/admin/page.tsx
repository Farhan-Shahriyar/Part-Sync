import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Data Entry Dashboard</h1>
            <p className="text-muted-foreground">Select a category from the sidebar to insert new records into the database.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholders for admin stats if needed later */}
            </div>
        </div>
    );
}
