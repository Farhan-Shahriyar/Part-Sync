'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Clock, AlertTriangle, CheckCircle } from "lucide-react";
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
};

type Requirement = {
    name: string;
    part_number: string;
    quantity: number;
    quantity_on_hand: number;
};

export function JobCard({ job, requirements }: { job: Job, requirements: Requirement[] }) {
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
        <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-700' :
            job.status === 'COMPLETED' ? 'bg-green-500/20 text-green-700' :
                'bg-orange-500/20 text-orange-600'
            }`}>
            {job.status}
        </span>
    );

    return (
        <>
            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{job.service_name}</CardTitle>
                            <p className="text-sm text-orange-500 font-medium">Order #{job.order_id}</p>
                        </div>
                        <StatusBadge />
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wrench className="w-4 h-4" />
                        <span className="font-semibold">{job.make} {job.model} ({job.license_plate})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Due: {new Date(job.order_date).toLocaleDateString()}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Customer</p>
                        <p className="text-sm font-medium">{job.customer_name}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Details</Button>

                    {job.status === 'ASSIGNED' && (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleStart} disabled={loading}>
                            {loading ? 'Starting...' : 'Start Job'}
                        </Button>
                    )}

                    {job.status === 'IN_PROGRESS' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setCompleteOpen(true)} disabled={loading}>
                            Complete
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
