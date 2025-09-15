"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"

export default function GstSearchAndDetailForm() {
    const [gstNumber, setGstNumber] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [details, setDetails] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<"idle" | "gstSearch" | "manualSearch">("idle")

    // Step 1: Search via GST number -> fetch customerName -> auto Gemini
    async function handleSearchGST(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setCustomerName("")
        setDetails(null)
        setMode("gstSearch")

        try {
            const res = await fetch(`/api/gst-details?gstNumber=${encodeURIComponent(gstNumber)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })


            const data = await res.json()
            const name = data.customerName || ""
            setCustomerName(name)
            console.log(data)
            // Auto-fetch Gemini after GST API success
            // await handleFetchGemini(gstNumber, name)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Manual search by GST + Customer Name
    async function handleManualSearch(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setDetails(null)
        setMode("manualSearch")

        try {
            await handleFetchGemini(gstNumber, customerName)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Common Gemini fetch function
    async function handleFetchGemini(gst: string, name: string) {
        try {
            const res = await fetch("/api/gemini-gst", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gstNumber: gst, customerName: name }),
            })

            const data = await res.json()
            setDetails(data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="my-8 grid gap-8">
            {/* --- Option A: Search by GST Number --- */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Search by GST Number</h2>
                <form
                    onSubmit={handleSearchGST}
                    className="flex gap-4 max-w-md mb-4"
                >
                    <Input
                        placeholder="Enter GST Number"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading && mode === "gstSearch" ? "Searching..." : "Search GST"}
                    </Button>
                </form>
            </div>

            {/* --- Option B: Manual Search (GST + Name) --- */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Search by GST + Name</h2>
                <form
                    onSubmit={handleManualSearch}
                    className="grid gap-4 max-w-md mb-4"
                >
                    <Input
                        placeholder="GST Number"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                    />
                    <Input
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading && mode === "manualSearch"
                            ? "Fetching details..."
                            : "Get Details"}
                    </Button>
                </form>
            </div>

            {/* --- Show Gemini Details --- */}
            {details && (
                <Card className="p-4">
                    <CardContent className="p-0">
                        <p><strong>Customer Name:</strong> {details.customerName}</p>
                        <p><strong>GST Number:</strong> {details.gstNumber}</p>
                        <p><strong>Business Type:</strong> {details.businessType}</p>
                        <p><strong>Address:</strong> {details.address}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
