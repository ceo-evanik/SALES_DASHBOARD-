"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"

export default function GstSearchAndDetailForm() {
    const [gstNumber, setGstNumber] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [gstDetails, setGstDetails] = useState<GSTData | null>(null)
    const [geminiDetails, setGeminiDetails] = useState<GeminiDetails | null>(null)
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<"idle" | "gstSearch" | "manualSearch">("idle")

    // Fetch GST taxpayer details
    async function handleSearchGST(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setGstDetails(null)
        setGeminiDetails(null)
        setMode("gstSearch")

        try {
            const res = await fetch(`/api/gst-details?gstNumber=${encodeURIComponent(gstNumber)}`)
            const data = await res.json()
            setGstDetails(data.data)
            setCustomerName(data.customerName || "")

            // Auto-fetch Gemini after GST API success
            if (data.customerName) {
                await handleFetchGemini(gstNumber, data.customerName)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    // Manual Gemini search
    async function handleManualSearch(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setGeminiDetails(null)
        setMode("manualSearch")

        try {
            await handleFetchGemini(gstNumber, customerName)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Common Gemini fetcher
    async function handleFetchGemini(gst: string, name: string) {
        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gstNumber: gst, customerName: name }),
            })

            const data = await res.json()
            setGeminiDetails(data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="my-8 space-y-8">
            {/* --- GST Search Section --- */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Search Taxpayer Details</h2>
                <p className="text-gray-600 mb-4">Enter a GSTIN to fetch public details from the API.</p>
                <form onSubmit={handleSearchGST} className="flex gap-4 max-w-lg">
                    <Input
                        placeholder="Enter GST Number"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading && mode === "gstSearch" ? "Searching..." : "Search"}
                    </Button>
                </form>
            </Card>

            {/* --- Taxpayer Details --- */}
            {gstDetails && (
                <Card className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Taxpayer Details</h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <p><strong>Legal Name:</strong> {gstDetails.lgnm}</p>
                        <p><strong>Trade Name:</strong> {gstDetails.tradeNam}</p>
                        <p><strong>GSTIN:</strong> {gstDetails.gstin}</p>
                        <p><strong>Status:</strong> {gstDetails.sts}</p>
                        <p><strong>Registration Date:</strong> {gstDetails.rgdt}</p>
                        <p><strong>Last Updated:</strong> {gstDetails.lstupdt}</p>
                        <p><strong>Taxpayer Type:</strong> {gstDetails.ctb}</p>
                        <p><strong>e-Invoice Status:</strong> {gstDetails.einvoiceStatus}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold mt-4">Principal Place of Business</h4>
                        <p>
                            {[
                                gstDetails?.pradr?.addr?.flno,
                                gstDetails?.pradr?.addr?.bnm,
                                gstDetails?.pradr?.addr?.bno,
                                gstDetails?.pradr?.addr?.st,
                                gstDetails?.pradr?.addr?.locality,
                                gstDetails?.pradr?.addr?.loc,
                                gstDetails?.pradr?.addr?.dst,
                                gstDetails?.pradr?.addr?.pncd,
                                gstDetails?.pradr?.addr?.stcd,
                            ]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                    </div>

                    {gstDetails.nba?.length > 0 && (
                        <div>
                            <h4 className="font-semibold mt-4 text-gray-800 dark:text-gray-100">
                                Nature of Business
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {gstDetails.nba.map((biz: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="
            px-2 py-1 rounded text-sm
            bg-gray-100 text-gray-800
            dark:bg-gray-800 dark:text-gray-100
          "
                                    >
                                        {biz}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </Card>
            )}

            {/* --- Gemini-powered Search --- */}
            <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Gemini-powered Customer Search</h2>
                <p className="text-gray-600">
                    Get more details about a customer using their name and GSTIN.
                </p>

                <form onSubmit={handleManualSearch} className="grid gap-4 max-w-lg">
                    <Input
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <Input
                        placeholder="GST Number"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                    />
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                        {loading && mode === "manualSearch" ? "Fetching..." : "Get More Details"}
                    </Button>
                </form>

                {/* --- Gemini Details --- */}
                {geminiDetails && (
                    <Card className="p-4 ">
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Lead Profile:</strong> {geminiDetails.CustomerName}</p>
                            <h4 className="font-semibold">Company Overview</h4>
                            <p><strong>Official Name:</strong> {geminiDetails.customerName}</p>
                            <p><strong>Business Description:</strong> {geminiDetails.businessDescription}</p>
                            <p><strong>Official Website URL:</strong> {geminiDetails.website || "Not available"}</p>
                            <p><strong>Company Logo URL:</strong> {geminiDetails.logo || "Not available"}</p>

                            <h4 className="font-semibold mt-2">Contact Information</h4>
                            <p><strong>Email:</strong> {geminiDetails.email || "Not available"}</p>
                            <p><strong>Phone:</strong> {geminiDetails.phone || "Not available"}</p>
                            <p><strong>Registered Address:</strong> {geminiDetails.address}</p>

                            {geminiDetails.directors && (
                                <>
                                    <h4 className="font-semibold mt-2">Key Personnel</h4>
                                    <ul className="list-disc list-inside">
                                        {geminiDetails.directors.map((d: string, i: number) => (
                                            <li key={i}>{d}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <h4 className="font-semibold mt-2">Social Media Handles</h4>
                            <p><strong>LinkedIn:</strong> {geminiDetails.linkedin || "Not available"}</p>
                            <p><strong>Twitter:</strong> {geminiDetails.twitter || "Not available"}</p>
                            <p><strong>Other:</strong> {geminiDetails.other || "Not available"}</p>
                        </CardContent>
                    </Card>
                )}
            </Card>
        </div>
    )
}
