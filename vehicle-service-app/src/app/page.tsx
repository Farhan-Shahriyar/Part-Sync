import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench, ShieldCheck, Clock, User, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
      <header className="px-8 py-5 flex justify-between items-center border-b border-white/5 backdrop-blur-xl bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-b from-primary to-primary/60 flex items-center justify-center text-primary-foreground shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-widest text-white uppercase">
            Part<span className="text-primary">Sync</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
            Client Login
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-wider uppercase rounded-none px-6 shadow-[0_0_10px_rgba(255,215,0,0.15)] transition-all">
              Reserve Service
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        {/* Full Screen Hero with Split Details */}
        <div className="relative w-full h-[85vh] flex items-center overflow-hidden">
          <Image
            src="/hero-bg.png"
            alt="Luxury Garage Hero Image"
            fill
            className="object-cover object-center opacity-40 mix-blend-luminosity scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <div className="relative z-10 px-12 md:px-24 flex flex-col items-start text-left max-w-4xl space-y-6">
            <div className="h-[1px] w-16 bg-primary mb-2 shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white leading-[1.1]">
              Excellence In <br />
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary">
                Automotive Care
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl font-light leading-relaxed">
              Experience unparalleled precision and engineering excellence. A premium platform for discerning vehicle owners to monitor maintenance and luxury inventory.
            </p>
            <div className="flex flex-wrap gap-4 pt-8">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest rounded-none shadow-[0_4px_20px_rgba(255,215,0,0.3)] hover:shadow-[0_4px_30px_rgba(255,215,0,0.5)] transition-all flex border border-primary/50 group">
                  Discover Our Services <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-sm font-bold uppercase tracking-widest rounded-none border-zinc-700 hover:border-primary hover:bg-primary/10 text-white transition-all bg-black/20 backdrop-blur">
                  Technician Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="relative z-20 -mt-16 px-8 md:px-16 w-full mb-24">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-none border-t-2 border-primary/50 group hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-light tracking-wide text-white mb-3">Immaculate Detail</h3>
              <p className="text-zinc-400 font-light leading-relaxed">Certified specialists providing meticulous care. We only use authentic, high-performance components tailored for your specific vehicle class.</p>
            </div>

            {/* Image Card Feature */}
            <div className="relative group overflow-hidden border border-white/5 h-full min-h-[250px] shadow-2xl">
              <Image
                src="/engine-detail.png"
                alt="Engine Detail"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-xl font-light tracking-wide text-white mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Synchronized Insight
                </h3>
                <p className="text-zinc-300 font-light text-sm">Monitor your vehicle's telemetry and repair status seamlessly from a dedicated personal suite.</p>
              </div>
            </div>

            <div className="glass p-8 rounded-none border-t-2 border-primary/50 group hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-light tracking-wide text-white mb-3">Bespoke Client Care</h3>
              <p className="text-zinc-400 font-light leading-relaxed">A concierge-level experience from arrival to departure. Transparent, itemized ledger and dedicated service management.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-zinc-500 font-light tracking-wider uppercase text-xs">
        <div className="opacity-50">
          &copy; 2026 PartSync Automotive Concierge. The Standard of Excellence.
        </div>
      </footer>
    </div>
  );
}
