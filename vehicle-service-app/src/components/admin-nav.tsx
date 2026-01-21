"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Car, Package, Wrench, LayoutDashboard } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/jobs", label: "Jobs", icon: Wrench },
    { href: "/admin/data-entry/customers", label: "Add Customer", icon: Users },
    { href: "/admin/data-entry/vehicles", label: "Add Vehicle", icon: Car },
    { href: "/admin/data-entry/parts", label: "Add Inventory", icon: Package },
    { href: "/admin/data-entry/mechanics", label: "Add Mechanic", icon: Wrench },
];

export function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10",
                            isActive ? "bg-primary/20 text-primary border border-primary/20" : "text-muted-foreground"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                );
            })}

            <div className="mt-auto pt-4 border-t border-border">
                <LogoutButton />
            </div>
        </nav>
    );
}
