"use client"

import { registerCustomer } from "./actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        return await registerCustomer(formData);
    }, null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative font-sans selection:bg-primary/30 py-12">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <Card className="w-full max-w-md glass border-white/5 bg-black/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <CardHeader className="space-y-4 pb-6 border-b border-white/5">
                    <div className="text-center">
                        <CardTitle className="text-2xl font-light text-white tracking-widest uppercase">
                            Create <span className="font-semibold text-primary">Account</span>
                        </CardTitle>
                        <CardDescription className="text-zinc-500 font-light tracking-wide mt-2">
                            Register to book services and track your vehicle history
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form action={formAction} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-zinc-300">First Name</Label>
                                <Input id="firstName" name="firstName" required placeholder="John" className="bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-zinc-300">Last Name</Label>
                                <Input id="lastName" name="lastName" required placeholder="Doe" className="bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-zinc-300">Phone</Label>
                            <Input id="phone" name="phone" required placeholder="555-0101" className="bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/5 mt-2">
                            <Label htmlFor="username" className="text-zinc-300">Username</Label>
                            <Input id="username" name="username" required placeholder="johndoe123" className="bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <Input id="password" name="password" type="password" required className="bg-black/50 text-white border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary placeholder:text-zinc-600" />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-500 font-medium">{state.error}</p>
                        )}
                        <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.15)] transition-all mt-6" disabled={isPending}>
                            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> CREATING ACCOUNT...</> : "REGISTER"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-zinc-500 font-light border-t border-white/5 pt-6">
                    Already have an account?
                    <Link href="/login" className="ml-1 font-medium text-primary hover:underline transition-all">
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
