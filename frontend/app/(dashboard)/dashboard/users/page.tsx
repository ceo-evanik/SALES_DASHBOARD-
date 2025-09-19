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
import { Loader2, Pencil, PlusCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

    // ✅ Filters state
    const [searchName, setSearchName] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [userTypeFilter, setUserTypeFilter] = useState("all");

    // ✅ Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    // ✅ Apply filters before pagination
    const filteredUsers = users.filter((user) => {
        const matchesName = user.name
            .toLowerCase()
            .includes(searchName.toLowerCase());

        const matchesDepartment =
            departmentFilter === "all" ? true : user.department === departmentFilter;

        const matchesUserType =
            userTypeFilter === "all" ? true : user.userType === userTypeFilter;

        return matchesName && matchesDepartment && matchesUserType;
    });

    // ✅ Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="p-2 max-w-[85vw] lg:max-w-[78vw]">
            <h1 className="text-xl font-bold mb-4">Users</h1>

            {/* ✅ Filters */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search by name */}
                <Input
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        setCurrentPage(1); // reset page
                    }}
                />

                {/* Department filter */}
                <Select
                    value={departmentFilter}
                    onValueChange={(value) => {
                        setDepartmentFilter(value);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                </Select>

                {/* User type filter */}
                <Select
                    value={userTypeFilter}
                    onValueChange={(value) => {
                        setUserTypeFilter(value);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by User Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-10 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading users...
                </div>
            ) : (
                <>
                    <div className="border rounded">
                        <Table className="max-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Id</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Contact No</TableHead>
                                    <TableHead>User Type</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Supervisor ID</TableHead>
                                    <TableHead>Supervisor Name</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.salespersonId}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.contactNo}</TableCell>
                                            <TableCell className="capitalize">
                                                {user.userType}
                                            </TableCell>
                                            <TableCell>{user.department}</TableCell>
                                            <TableCell>{user.supervisorId}</TableCell>
                                            <TableCell>{user.supervisorName}</TableCell>
                                            <TableCell className="flex flex-col items-start gap-2">
                                                <Link
                                                    href={{
                                                        pathname: "/dashboard/users/add-target",
                                                        query: {
                                                            mode: "create",
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
                                                <Link
                                                    href={{
                                                        pathname: "/dashboard/users/add-target",
                                                        query: {
                                                            mode: "update",
                                                            userId: user._id,
                                                            name: user.name,
                                                            salespersonId: user.salespersonId,
                                                        },
                                                    }}
                                                >
                                                    <Button size="sm" variant="outline">
                                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                                        Update Target
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={{
                                                        pathname: "/dashboard/users/update-user",
                                                        query: {
                                                            userId: user._id,
                                                            email: user.email,
                                                            contactNo: user.contactNo,
                                                            department: user.department,
                                                            supervisorId: user.supervisorId,
                                                            supervisorName: user.supervisorName,
                                                        },
                                                    }}
                                                >
                                                    <Button size="sm" variant="outline">
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit User
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="text-center text-gray-500 py-4"
                                        >
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ✅ Pagination below table */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
