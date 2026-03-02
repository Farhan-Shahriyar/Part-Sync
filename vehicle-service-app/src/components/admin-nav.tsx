"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Car, Package, Wrench, LayoutDashboard, FileText, PlusCircle, Box } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: FileText },
    { href: "/admin/mechanics", label: "Mechanics", icon: Wrench },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/suppliers", label: "Suppliers", icon: Box },
    { href: "/admin/inventory", label: "Inventory", icon: Package },
];

export function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all group border border-transparent",
                            isActive
                                ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_rgba(255,215,0,1)] border-white/5"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Icon className={cn("w-4 h-4", isActive ? "text-primary flex-shrink-0" : "text-zinc-500 group-hover:text-zinc-300 flex-shrink-0")} />
                        <span className="tracking-wide">{item.label}</span>
                    </Link>
                );
            })}

            <div className="mt-8 pt-6 border-t border-white/10">
                <LogoutButton />
            </div>
        </nav>
    );
}
