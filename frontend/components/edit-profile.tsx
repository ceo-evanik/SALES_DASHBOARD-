'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  contactNo: string;
  userType: string;
  status: string;
  isActive?: boolean;
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
        // 🔹 Save updated profile in localStorage for auto-refresh
        localStorage.setItem("updatedUserProfile", JSON.stringify({
          name: profile.name,
          email: profile.email
        }));
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
    <div className="min-h-screen  dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-6 py-4">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Edit Profile
          </CardTitle>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="px-4 py-1 dark:border-gray-600 dark:text-gray-200">
              Cancel
            </Button>
          </Link>
        </CardHeader>

        {/* Content */}
        <CardContent className="bg-white dark:bg-gray-700 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* User Type */}
            <div className="space-y-1">
              <Label>User Type</Label>
              <Input
                value={profile.userType}
                disabled
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label>Status</Label>
              <Input
                value={profile.isActive !== undefined ? (profile.isActive ? "active" : "inactive") : profile.status}
                disabled
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Created At */}
            <div className="space-y-1 md:col-span-2">
              <Label>Created At</Label>
              <Input
                value={profile.createdAt}
                disabled
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <Button
            onClick={updateProfile}
            disabled={loading}
            className="w-full py-3 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-xl transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
