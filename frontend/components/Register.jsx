"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
   const router = useRouter();
   const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
   });

   const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (
         !formData.first_name ||
         !formData.last_name ||
         !formData.email ||
         !formData.password
      ) {
         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            text: "All fields are required.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
         });
         return;
      }

      try {
         await axios.post(`${API}/api/auth/register`, formData);

         await Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            text: "Registration successful! Please log in.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
         });
         router.push("/login");
      } catch (err) {

         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            text: err.response?.data?.message || "An error occurred",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
         });
      }
   };

   return (
      <Card className="w-full max-w-md mx-auto">
         <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-col items-center mb-7">
               <img
                  src="/avatar.svg"
                  alt="Sign Up"
                  className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
               />
               <CardTitle className="text-teal-700">Sign Up</CardTitle>
               <CardDescription>
                  Enter your information to create an account.
               </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="first_name">First Name</Label>
                     <Input
                        id="first_name"
                        name="first_name"
                        placeholder="Max"
                        value={formData.first_name}
                        onChange={onChange}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="last_name">Last Name</Label>
                     <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Robinson"
                        value={formData.last_name}
                        onChange={onChange}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     name="email"
                     type="email"
                     placeholder="m@example.com"
                     value={formData.email}
                     onChange={onChange}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     name="password"
                     type="password"
                     value={formData.password}
                     onChange={onChange}
                  />
               </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 mt-8">
               <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700  cursor-pointer">
                  {/* 5. Button text is now static */}
                  Create Account
               </Button>
               <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                     Sign in
                  </Link>
               </div>
            </CardFooter>
         </form>
      </Card>
   );
};

export default Register;
