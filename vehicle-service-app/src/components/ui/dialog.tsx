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
    // If we want to support Trigger properly without a complex context, we can just render children.
    // However, the standard Radix/Shadcn pattern uses Context.
    // For this simple custom implementation, we'll assume the parent controls state OR we simply render the children
    // and let the Trigger (if it's a button) handle its own onClick if passed?
    // Actually, `DialogTrigger` is usually just a button that calls setOpen(true).
    // But here we are passing open/onOpenChange to the Root.
    // Let's keep it simple: The custom Dialog usage in my code (e.g. RestockDialog) controls its own state.
    // It wraps the whole thing.
    // BUT `DialogTrigger` is used inside the Dialog component in my `add-vehicle` code. 
    // ` <Dialog open={open} onOpenChange={setOpen}> <DialogTrigger>...</DialogTrigger> ... </Dialog>`
    // This implies `Dialog` should provide context. 
    // Since I can't easily rewrite the whole UI library to be Context-based right now without more code,
    // I will simplify: I'll make `DialogTrigger` a simple pass-through that doesn't actually "Trigger" unless manually wired,
    // OR better, I'll update my usage to NOT use DialogTrigger and just use the Button with onClick, but I used `asChild`.
    // Wait, the `AddVehicleDialog` uses `DialogTrigger asChild`. 
    // I will simply add a dummy `DialogTrigger` that renders its children. The User's click handler on the button inside it (if I added one) would work, 
    // BUT I didn't add one in `AddVehicleDialog`. 
    // ` <DialogTrigger asChild> <Button ...> ... </Button> </DialogTrigger>`
    // The Button needs `onClick={() => setOpen(true)}`.
    // I will update `AddVehicleDialog` and others to NOT use `DialogTrigger` if this `Dialog` component doesn't support it.
    // The current `RestockDialog` manually handles the button.
    // `AddVehicleDialog` tries to use Trigger. 
    // I'll update `AddVehicleDialog` to match `RestockDialog` pattern (manual button + Dialog).

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

// Adding dummy export to satisfy import, but I should really refactor usage.
export function DialogTrigger({ children, asChild }: any) {
    return children;
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-background border rounded-lg shadow-lg w-full max-w-lg relative overflow-hidden flex flex-col gap-4 p-6 ${className || ''}`}>
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
