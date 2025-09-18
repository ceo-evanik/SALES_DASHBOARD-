"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface User {
    _id: string;
    name: string;
    email: string;
    contactNo: string;
    userType: string;
    department: string;
    supervisorId: string;
    supervisorName: string;
    salespersonId: string;
}

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/register-user", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });

                const data = await res.json();
                setUsers(data.data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className="p-2 max-w-[85vw] lg:max-w-[78vw]">
            <h1 className="text-xl font-bold mb-4">Users</h1>

            {loading ? (
                <div className="flex items-center justify-center py-10 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading users...
                </div>
            ) : (
                <div className="border rounded ">
                    <Table className="max-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Id</TableHead>
                                <TableHead className="whitespace-nowrap">Name</TableHead>
                                <TableHead className="whitespace-nowrap">Email</TableHead>
                                <TableHead className="whitespace-nowrap">Contact No</TableHead>
                                <TableHead className="whitespace-nowrap">User Type</TableHead>
                                <TableHead className="whitespace-nowrap">Department</TableHead>
                                <TableHead className="whitespace-nowrap">Supervisor ID</TableHead>
                                <TableHead className="whitespace-nowrap">Supervisor Name</TableHead>
                                <TableHead className="whitespace-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="whitespace-nowrap">{user.salespersonId}</TableCell>
                                        <TableCell className="whitespace-nowrap">{user.name}</TableCell>
                                        <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                                        <TableCell className="whitespace-nowrap">{user.contactNo}</TableCell>
                                        <TableCell className="whitespace-nowrap capitalize">{user.userType}</TableCell>
                                        <TableCell className="whitespace-nowrap">{user.department}</TableCell>
                                        <TableCell className="whitespace-nowrap">{user.supervisorId}</TableCell>
                                        <TableCell className="whitespace-nowrap">{user.supervisorName}</TableCell>
                                        <TableCell className="whitespace-nowrap flex flex-col items-start gap-2">
                                            <Link
                                                href={{
                                                    pathname: "/dashboard/users/add-target",
                                                    query: {
                                                        userId: user._id,
                                                        name: user.name,
                                                        salespersonId: user.salespersonId,
                                                    },
                                                }}
                                            >
                                                <Button size="sm" variant="outline">
                                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Target
                                                </Button>
                                            </Link>
                                        </TableCell>

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-gray-500 py-4"
                                    >
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
