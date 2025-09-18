"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function AddTargetPage() {
    const searchParams = useSearchParams();

    const userId = searchParams.get("userId") || "";
    const name = searchParams.get("name") || "";
    const salespersonId = searchParams.get("salespersonId") || "";

    const [revenueStream, setRevenueStream] = useState("Acquisition");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [totalTarget, setTotalTarget] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/add-target", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    evkId: 2002,
                    userId,
                    name,
                    revenueStream,
                    zohoSalespersonId: salespersonId,
                    date: date ? format(date, "yyyy-MM-dd") : null, // format for API
                    totalTarget,
                    totalAch: 0,
                    imageUrl: null,
                }),
            });

            console.log(res)

            if (!res.ok) {
                setMessage("Target not created!");
            } else {
                setMessage("✅ Target created successfully!");
                setDate(undefined);
                setTotalTarget(0);
            }
        } catch (error) {
            setMessage("❌ Error creating target");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Add Target</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (read-only) */}
                <div>
                    <Label>Name</Label>
                    <Input value={name} disabled />
                </div>

                {/* Revenue Stream */}
                <div>
                    <Label>Revenue Stream</Label>
                    <Input
                        value={revenueStream}
                        onChange={(e) => setRevenueStream(e.target.value)}
                        required
                    />
                </div>

                {/* Date Picker (shadcn calendar) */}
                <div>
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Target Amount */}
                <div>
                    <Label>Total Target</Label>
                    <Input
                        type="number"
                        value={totalTarget}
                        onChange={(e) => setTotalTarget(Number(e.target.value))}
                        required
                    />
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        "Save Target"
                    )}
                </Button>
            </form>

            {message && (
                <p
                    className={`mt-4 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
