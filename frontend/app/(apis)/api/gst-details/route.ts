import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const gstNumber = searchParams.get("gstNumber")

    if (!gstNumber) {
        return NextResponse.json(
            { error: "gstNumber query parameter is required" },
            { status: 400 }
        )
    }

    try {
        const res = await fetch(`${process.env.GST_FETCH_URL}${gstNumber}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "client_id": process.env.GST_API_CLIENT_ID!,
                "client_secret": process.env.GST_API_SECRET!,
            },
        })

        const data = await res.json()
        return NextResponse.json({
            customerName: data.data.lgnm || "Unknown",
            data : data.data,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to fetch GST details" },
            { status: 500 }
        )
    }
}
