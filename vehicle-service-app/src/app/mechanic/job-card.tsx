'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Clock, AlertTriangle, CheckCircle, Timer } from "lucide-react";
import { startJob, completeJob } from "./actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Job = {
    job_id: number;
    service_name: string;
    order_id: number;
    status: string;
    make: string;
    model: string;
    license_plate: string;
    order_date: string;
    customer_name: string;
    service_type_id: number;
    started_at?: string;
};

function LiveTimer({ startedAt }: { startedAt: string }) {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
        const start = new Date(startedAt).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diffMs = now - start;

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const mins = Math.floor((diffMs / (1000 * 60)) % 60);
            const secs = Math.floor((diffMs / 1000) % 60);

            setElapsed(
                `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    return (
        <div className="flex items-center gap-1 text-sm font-mono font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded">
            <Timer className="w-4 h-4" />
            {elapsed}
        </div>
    );
}

type Requirement = {
    name: string;
    part_number: string;
    quantity: number;
    quantity_on_hand: number;
};

export function JobCard({ job, requirements = [], isActive = true }: { job: Job, requirements?: Requirement[], isActive?: boolean }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [completeOpen, setCompleteOpen] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            await startJob(job.job_id);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            const res = await completeJob(job.job_id, job.service_type_id);
            if (!res.success) {
                alert(res.error); // Simple feedback for now
            } else {
                setCompleteOpen(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = () => (
        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold border ${job.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary border-primary/30' :
            job.status === 'COMPLETED' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' :
                'bg-white/5 text-white border-white/20'
            }`}>
            {job.status}
        </span>
    );

    return (
        <>
            <Card className={`glass overflow-hidden border-white/5 transition-all hover:bg-white/5 bg-black/40 ${isActive ? 'border-l-4 border-l-primary/50' : 'opacity-70 grayscale-[30%]'}`}>
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg font-medium text-white tracking-wide">{job.service_name}</CardTitle>
                            <p className="text-xs text-primary font-mono mt-1 tracking-widest">ORDER #{job.order_id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <StatusBadge />
                            {job.status === 'IN_PROGRESS' && job.started_at && (
                                <LiveTimer startedAt={job.started_at} />
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-black/40 p-3 rounded border border-white/5 space-y-2 text-sm">
                        <div className="flex items-center justify-between text-zinc-300">
                            <div className="flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-primary" />
                                <span>Vehicle</span>
                            </div>
                            <span className="font-semibold">{job.make} {job.model} ({job.license_plate})</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-300">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>Due Date</span>
                            </div>
                            <span className="font-semibold">{new Date(job.order_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="pt-2 flex justify-between items-center text-sm">
                        <span className="text-zinc-500 font-light">Client:</span>
                        <span className="text-white font-medium">{job.customer_name}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-2 border-t border-white/5">
                    <Button variant="outline" size="sm" className="border-white/10 hover:border-primary/50 text-zinc-300 rounded-sm font-bold tracking-wider" onClick={() => setOpen(true)}>DETAILS</Button>

                    {isActive && job.status === 'ASSIGNED' && (
                        <Button size="sm" className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-wider rounded-sm shadow-[0_0_10px_rgba(255,215,0,0.15)]" onClick={handleStart} disabled={loading}>
                            {loading ? 'STARTING...' : 'COMMENCE WORK'}
                        </Button>
                    )}

                    {isActive && job.status === 'IN_PROGRESS' && (
                        <Button size="sm" className="bg-white hover:bg-zinc-200 text-black font-bold tracking-wider rounded-sm" onClick={() => setCompleteOpen(true)} disabled={loading}>
                            MARK COMPLETE
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Details Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Job Details: {job.service_name}</DialogTitle>
                        <DialogDescription>
                            Full details for Order #{job.order_id}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Customer Instructions</h4>
                            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                No specific notes provided.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Wrench className="w-4 h-4" /> Required Parts
                            </h4>
                            {requirements.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No parts required for this service.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {requirements.map((part, idx) => {
                                        const hasStock = part.quantity_on_hand >= part.quantity;
                                        return (
                                            <li key={idx} className="flex justify-between items-center text-sm border p-2 rounded">
                                                <div>
                                                    <p className="font-medium">{part.name}</p>
                                                    <p className="text-xs text-muted-foreground">{part.part_number}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">x{part.quantity}</p>
                                                    {!hasStock && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Low Stock ({part.quantity_on_hand})</p>}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Complete Confirm Modal */}
            <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Job</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to mark this job as complete? This will deduct the required parts from inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCompleteOpen(false)}>Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleComplete} disabled={loading}>
                            {loading ? 'Completing...' : 'Confirm Completion'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
