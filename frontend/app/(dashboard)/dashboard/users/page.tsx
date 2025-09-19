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
import {
  Loader2,
  Pencil,
  PlusCircle,
  RefreshCcw,
  UserCircle,
  Target,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Target {
  _id: string;
  totalTarget: number;
  date: string;
}

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
  targets?: Target[];
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
    <div className="p-6 w-full lg:w-[95%] mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
        <UserCircle className="h-8 w-8 text-indigo-600" />
        Users Management
      </h1>

      {/* ✅ Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="🔍 Search by name..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
          className="shadow-sm"
        />

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
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>

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
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading users...
        </div>
      ) : (
        <>
          <div className="border rounded shadow-lg overflow-hidden">
            <Table className="w-full text-sm">
              <TableHeader className="bg-indigo-50">
                <TableRow>
                  <TableHead>Salesperson ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Targets</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      className="hover:bg-indigo-50/40 transition"
                    >
                      <TableCell>{user.salespersonId}</TableCell>
                      <TableCell className="font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell className="break-words">
                        {user.email}
                      </TableCell>
                      <TableCell>{user.contactNo}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.userType}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.supervisorName}</TableCell>
                      <TableCell>
                        {user.targets && user.targets.length > 0 ? (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Target className="h-3 w-3 text-green-600" />
                            {user.targets.length} Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive">No Target</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {/* ✅ Always show Add Target */}
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
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <PlusCircle className="mr-1 h-4 w-4" />
                              Add Target
                            </Button>
                          </Link>

                          {/* ✅ Show Update Target only if targets exist */}
                          {user.targets && user.targets.length > 0 && (
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
                              <Button size="sm" variant="default">
                                <RefreshCcw className="mr-1 h-4 w-4" />
                                Update Target
                              </Button>
                            </Link>
                          )}

                          {/* ✅ Always show Edit User */}
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
                              <Pencil className="mr-1 h-4 w-4" /> Edit User
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-gray-500 py-6"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ✅ Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
