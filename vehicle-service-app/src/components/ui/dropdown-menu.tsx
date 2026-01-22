'use client';

import * as React from "react";
import { Link } from "lucide-react";

interface DropdownProps {
    children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative inline-block text-left" onMouseLeave={() => setOpen(false)}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { open, setOpen } as any);
                }
                return child;
            })}
        </div>
    );
}
import { useState } from "react";

export function DropdownMenuTrigger({ asChild, children, open, setOpen }: any) {
    return (
        <div onClick={() => setOpen(!open)}>
            {children}
        </div>
    );
}

export function DropdownMenuContent({ align, children, open }: any) {
    if (!open) return null;
    return (
        <div className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} z-50 mt-2 w-56 origin-top-right rounded-md bg-popover text-popover-foreground shadow-md border animate-in fade-in zoom-in-95`}>
            <div className="p-1">
                {children}
            </div>
        </div>
    );
}

export function DropdownMenuItem({ children, onClick }: any) {
    return (
        <div
            className="cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={onClick}
        >
            {children}
        </div>
    );
}
