import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, ShieldCheck, Clock, User } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-8 py-6 flex justify-between items-center border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            PartSync
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-background to-background -z-10" />

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-foreground">
          Expert Vehicle Service <br />
          <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
            Simplified.
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The all-in-one platform for vehicle maintenance, service tracking, and inventory management.
          Monitor your repairs in real-time.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white shadow-xl shadow-orange-500/20">
              Book a Service
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-orange-200 hover:bg-orange-50 hover:text-orange-700">
              Mechanic Portal
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          <div className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Reliable Service</h3>
            <p className="text-muted-foreground">Certified mechanics and genuine parts ensure your vehicle runs perfectly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">Track your repair status live from your personal dashboard.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Customer First</h3>
            <p className="text-muted-foreground">Easy booking, transparent pricing, and complete service history.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        &copy; 2026 PartSync Vehicle Services. All rights reserved.
      </footer>
    </div>
  );
}
