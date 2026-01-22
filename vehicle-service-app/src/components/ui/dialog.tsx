'use client';

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={() => onOpenChange(false)}
        >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
                {children}
            </div>
        </div>
    );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background border rounded-lg shadow-lg w-full max-w-lg relative overflow-hidden flex flex-col gap-4 p-6">
            {children}
        </div>
    );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>;
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{children}</div>;
}
