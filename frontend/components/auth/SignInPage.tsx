"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react"; // Eye icons

type LoginData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // new state

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://placeholder-url.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

          <div className="relative">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    className="pr-10" // right padding for icon
  />
  <button
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>


            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-sm text-center mt-2">
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => router.push("/register")}
              >
                Register
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
