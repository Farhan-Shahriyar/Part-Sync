'use client';

import { useState } from "react";
import { toggleAutoRestock } from "./auto-restock-action";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AutoRestockSwitch({ partId, initialState }: { partId: number, initialState: boolean }) {
    const [enabled, setEnabled] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (checked: boolean) => {
        setLoading(true);
        // Optimistic update
        setEnabled(checked);

        const res = await toggleAutoRestock(partId, checked);

        if (!res.success) {
            // Revert on failure
            setEnabled(!checked);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={`auto-restock-${partId}`}
                checked={enabled}
                onChange={(e) => handleToggle(e.target.checked)}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <Label htmlFor={`auto-restock-${partId}`} className="text-sm font-medium leading-none cursor-pointer">
                Auto-Restock
            </Label>
            {loading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
        </div>
    );
}
