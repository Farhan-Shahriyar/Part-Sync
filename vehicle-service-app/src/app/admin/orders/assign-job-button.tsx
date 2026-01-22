"use client";

import { useState } from "react";
import { assignJob } from "./actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function AssignJobButton({ jobId, mechanics }: { jobId: number; mechanics: any[] }) {
    const [loading, setLoading] = useState(false);

    const handleAssign = async (mechanicId: number) => {
        setLoading(true);
        try {
            await assignJob(jobId, mechanicId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" disabled={loading}>
                    <UserPlus className="w-3 h-3" />
                    Assign
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {mechanics.map((m) => (
                    <DropdownMenuItem key={m.mechanic_id} onClick={() => handleAssign(m.mechanic_id)}>
                        {m.first_name} {m.last_name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
