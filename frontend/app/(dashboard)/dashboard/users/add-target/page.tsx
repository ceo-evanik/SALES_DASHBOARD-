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

export default function TargetFormPage() {
    const searchParams = useSearchParams();

    // mode comes from query: "create" | "update"
    const mode = searchParams.get("mode") || "create";
    const isUpdate = mode === "update";

    // query values (for prefill in update mode)
    const userId = searchParams.get("userId") || "";
    const name = searchParams.get("name") || "";
    const salespersonId = searchParams.get("salespersonId") || "";

    const [revenueStream, setRevenueStream] = useState(
        searchParams.get("revenueStream") || "Acquisition"
    );
    const [date, setDate] = useState<Date | undefined>(
        searchParams.get("date") ? new Date(searchParams.get("date") as string) : undefined
    );
    const [totalTarget, setTotalTarget] = useState<string>(
        searchParams.get("totalTarget") || ""
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            const body = {
                userId,
                name,
                revenueStream,
                zohoSalespersonId: salespersonId,
                date: date ? format(date, "yyyy-MM-dd") : null,
                totalTarget: Number(totalTarget.trim()) || 0,
                totalAch: 0,
                imageUrl: null,
            };

            const res = await fetch(
                isUpdate ? `/api/target` : "/api/target",
                {
                    method: isUpdate ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!res.ok) {
                setMessage(`❌ ${isUpdate ? "Update failed" : "Create failed"}`);
            } else {
                setMessage(
                    `✅ Target ${isUpdate ? "updated" : "created"} successfully!`
                );
                if (!isUpdate) {
                    setDate(undefined);
                    setTotalTarget("");
                }
            }
        } catch (error) {
            setMessage("❌ Error saving target");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6 mt-4 border rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">
                {isUpdate ? "Update Target" : "Add Target"}
            </h1>

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

                {/* Date Picker */}
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
                        type="text"
                        value={totalTarget}
                        onChange={(e) => setTotalTarget(e.target.value)}
                        required
                    />
                </div>

                {/* Submit */}
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : isUpdate ? (
                        "Update Target"
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
