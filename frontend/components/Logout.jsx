"use client";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CiLogout } from "react-icons/ci";

const API = process.env.NEXT_PUBLIC_API_URL;

const Logout = () => {
  const router = useRouter();
  const handleLogout = async () => {
     await signOut({ callbackUrl: "/login" });
  };
  return (
     <Button
        onClick={handleLogout}
        variant="outline"
        className="ml-2 cursor-pointer hover:tranform hover:scale-99">
        <CiLogout className="mr-2 h-4 w-4" /> Logout
     </Button>
  );
};

export default Logout;