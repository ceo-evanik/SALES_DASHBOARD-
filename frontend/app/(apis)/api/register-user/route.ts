import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get("authorization");

        // Validate required fields
        const requiredFields = [
            'name', 'email', 'password', 'contactNo',
            'userType', 'salespersonId', 'department',
            'supervisorId', 'supervisorName'
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { message: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Make request to your backend API
        const response = await fetch('http://localhost:4003/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: 'Salesperson registered successfully', data },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}


export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const res = await fetch("http://localhost:4003/api/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            cache: "no-store", // always fetch fresh data
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch users" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get("authorization");

        // Require userId for updates
        if (!body.userId) {
            return NextResponse.json(
                { message: "Missing required field: userId" },
                { status: 400 }
            );
        }

        // Send update request to backend API
        const response = await fetch(
            `http://localhost:4003/api/users/${body.userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeader ? { Authorization: authHeader } : {}),
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || "Update failed" },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: "User updated successfully", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}