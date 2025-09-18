'use client';

import { useUser } from "@/context/UserProvider";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (loading) return <p className="text-center mt-20 text-lg text-gray-500 dark:text-gray-400">Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <div className="mb-8 text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <Card className="shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          
          {/* Top Card: Name, User Type & Edit */}
          <CardHeader className="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-700">
            <div>
              <CardTitle className="text-xl font-semibold">{user.name}</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">{user.userType}</p>
            </div>
            <Link href="/dashboard/profile/edit">
              <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200 px-4 py-1">
                Edit
              </Button>
            </Link>
          </CardHeader>

          {/* Bottom Card: Personal Information */}
          <CardContent className="pt-6 px-6 bg-white dark:bg-gray-700 space-y-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={email}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* User Type */}
              <div className="space-y-1">
                <Label>User Type</Label>
                <Input
                  value={user.userType}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <Label>Status</Label>
                <Input
                  value={'isActive' in user ? (user.isActive ? 'active' : 'inactive') : user.status || 'unknown'}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Created At */}
              <div className="space-y-1">
                <Label>Created At</Label>
                <Input
                  value={new Date(user.createdAt).toLocaleString()}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
