"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function UpdateUserPage() {
    const searchParams = useSearchParams()

    // Pre-fill from query
    const [form, setForm] = useState({
        userId: searchParams.get("userId") || "",
        email: searchParams.get("email") || "",
        userType: "user",
        contactNo: searchParams.get("contactNo") || "",
        department: searchParams.get("department") || "",
        supervisorId: searchParams.get("supervisorId") || "",
        supervisorName: searchParams.get("supervisorName") || "",
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const token = localStorage.getItem("token")
            const res = await fetch("/api/register-user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(form),
            })

            const data = await res.json()
            if (!res.ok) {
                setMessage(`❌ ${data.message || "Update failed"}`)
            } else {
                setMessage("✅ User updated successfully!")
            }
        } catch (error) {
            console.error(error)
            setMessage("❌ Internal server error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 border rounded-2xl shadow-lg bg-white dark:bg-slate-900">
            <h1 className="text-2xl font-bold mb-6">Update User</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Contact No */}
                <div>
                    <Label htmlFor="contactNo">Contact No</Label>
                    <Input
                        id="contactNo"
                        name="contactNo"
                        value={form.contactNo}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Department (Select) */}
                <div>
                    <Label htmlFor="department">Department</Label>
                    <Select
                        value={form.department}
                        onValueChange={(value) =>
                            setForm({ ...form, department: value })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Supervisor ID */}
                <div>
                    <Label htmlFor="supervisorId">Supervisor ID</Label>
                    <Input
                        id="supervisorId"
                        name="supervisorId"
                        value={form.supervisorId}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Supervisor Name */}
                <div>
                    <Label htmlFor="supervisorName">Supervisor Name</Label>
                    <Input
                        id="supervisorName"
                        name="supervisorName"
                        value={form.supervisorName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        "Update User"
                    )}
                </Button>
            </form>

            {message && <p className="mt-4 text-sm">{message}</p>}
        </div>
    )
}
