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