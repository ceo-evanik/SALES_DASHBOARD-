import RegisterFrom from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | NextAuth App",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <>
      <RegisterFrom />
    </>
  );
}
