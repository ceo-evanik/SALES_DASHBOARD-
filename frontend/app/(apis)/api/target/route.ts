import { NextResponse } from "next/server";

// Create Target
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get("authorization");

        const res = await fetch("http://localhost:4003/api/users/targets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data?.message || "Failed to create target" },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error in POST /api/targets:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Update Target
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const authHeader = req.headers.get("authorization");

        if (!body.userId) {
            return NextResponse.json(
                { error: "Missing userId for target update" },
                { status: 400 }
            );
        }

        const res = await fetch(
            `http://localhost:4003/api/users/targets/${body.userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeader ? { Authorization: authHeader } : {}),
                },
                body: JSON.stringify(body),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data?.message || "Failed to update target" },
                { status: res.status }
            );
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error in PUT /api/targets:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
