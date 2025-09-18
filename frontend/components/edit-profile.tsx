'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  contactNo: string;
  userType: string;
  status: string;
  isActive?: boolean; // backend me agar hai
  createdAt: string;
}

export default function EditProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    contactNo: "",
    userType: "",
    status: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(false);

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.id || null;
    } catch {
      return null;
    }
  };

  const fetchProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:4003/api/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success && data.data) {
        setProfile({
          name: data.data.name || "",
          email: data.data.email || "",
          contactNo: data.data.contactNo || "",
          userType: data.data.userType || "",
          status: data.data.status || "",
          isActive: data.data.isActive,
          createdAt: new Date(data.data.createdAt).toLocaleString() || "",
        });
      } else {
        toast.error("Failed to fetch profile data.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching profile.");
    }
  };

  const updateProfile = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Name and Email are required!");
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:4003/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard/profile");
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="bg-white shadow-lg rounded-xl">
        {/* Top section with Cancel button */}
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Personal Information
          </CardTitle>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="px-3 py-1">Cancel</Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email address</label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">User Type</label>
              <Input value={profile.userType} disabled />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
              <Input
                value={profile.isActive !== undefined ? (profile.isActive ? "active" : "inactive") : profile.status}
                disabled
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Created At</label>
              <Input value={profile.createdAt} disabled />
            </div>
          </div>

          <Button
            onClick={updateProfile}
            disabled={loading}
            className="w-full py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
