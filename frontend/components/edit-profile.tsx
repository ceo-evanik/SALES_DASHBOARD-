'use client';

import { useUser } from "@/context/UserProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function EditProfile() {
  const router = useRouter();
  const { user, loading, refreshUser } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required!");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4003/api/auth/me', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        refreshUser();
        router.push("/dashboard/profile");
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Update failed!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-20 text-lg text-gray-500 dark:text-gray-400">Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Top Heading Section */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Personal Information</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Update your details to keep your profile up-to-date.
          </p>
        </div>

        {/* Main Card */}
        <Card className="mb-8 border-0 shadow-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          {/* Top Card: Name */}
          <CardHeader className="bg-gray-100 dark:bg-gray-700 py-4 px-6 flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">{user.userType}</p>
            </div>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="mr-2">✕</Button>
            </Link>
          </CardHeader>

          {/* Bottom Card: Editable Information */}
          <CardContent className="pt-6 px-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* User Type (read-only) */}
              <div className="space-y-2">
                <Label>User Type</Label>
                <Input
                  value={user.userType}
                  readOnly
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                />
              </div>

              {/* Status (read-only) */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Input
                  value={'isActive' in user ? (user.isActive ? 'active' : 'inactive') : user.status || 'unknown'}
                  readOnly
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                />
              </div>

              {/* Created At (read-only) */}
              <div className="space-y-2">
                <Label>Created At</Label>
                <Input
                  value={new Date(user.createdAt).toLocaleString()}
                  readOnly
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="mt-6 flex justify-end gap-4">
              <Link href="/dashboard/profile">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                onClick={handleUpdate}
                disabled={updating}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
