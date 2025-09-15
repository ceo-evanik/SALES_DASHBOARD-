'use client';

import { useUser } from "@/context/UserProvider";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { user, loading, refreshUser } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Initialize state from user context
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Update profile
  const handleUpdate = async () => {
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

      if (res.ok) {
        toast.success("Profile updated successfully!");
        refreshUser(); // Refresh user context
      } else {
        toast.error("Update failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    }
  };

  if (loading) return <p className="text-center mt-20 text-lg text-gray-500">Loading...</p>;
  if (!user) return null;

  return (
    <main className="max-w-3xl px-8 bg-white rounded-lg ">
      
      {/* Welcome Section */}
      <section className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Your Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and account settings below.</p>
      </section>

      {/* Profile Form */}
      <section className="space-y-6">

        {/* Name */}
        <div className="space-y-1">
          <Label className="text-gray-700 font-medium">Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
         
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label className="text-gray-700 font-medium">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
         
        </div>

        {/* User Type */}
        <div className="space-y-1">
          <p className="text-gray-700 font-medium">User Type</p>
          <p className="text-gray-600">{user.userType}</p>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <p className="text-gray-700 font-medium">Status</p>
          <p className="text-gray-600">
            {'isActive' in user ? (user.isActive ? 'active' : 'inactive') : user.status || 'unknown'}
          </p>
        </div>

        {/* Created At */}
        <div className="space-y-1">
          <p className="text-gray-700 font-medium">Created At</p>
          <p className="text-gray-600">{new Date(user.createdAt).toLocaleString()}</p>
        </div>
      </section>

      {/* Update Button */}
      <section className="mt-8 text-center">
        <Button
          onClick={handleUpdate}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </Button>
      </section>
    </main>
  );
}
