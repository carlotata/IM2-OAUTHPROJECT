"use client";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_URL;

const Logout = () => {
  const router = useRouter();
  const handleLogout = async () => {
    // try {
    //   await axios.post(`${API}/api/auth/logout`, {}, {
    //     withCredentials: true,
    //   });
    //   router.push("/login");
    // } catch (error) {
    //   console.error("Logout failed:", error);
    // }
     await signOut({ callbackUrl: "/login" });
  };
  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
};

export default Logout;