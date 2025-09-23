"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

const ChangePassword = () => {
   const router = useRouter();
   const { data: session, status } = useSession();
   const [profileData, setProfileData] = useState({
      first_name: "",
      last_name: "",
   });
   const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirm_newPassword: "",
   });
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchProfile = async () => {
         if (session?.backendToken) {
            try {
               const res = await axios.get(`${API}/api/user/profile`, {
                  headers: {
                     Authorization: `Bearer ${session.backendToken}`,
                  },
               });
               setProfileData(res.data);
            } catch (err) {

               Swal.fire({
                  toast: true,
                  position: "top-end",
                  icon: "error",
                  title: "Session Error",
                  text: "Could not fetch user data. Redirecting to login.",
                  timer: 1000,
                  showConfirmButton: false,
                  timerProgressBar: true,
               }).then(() => {
                  router.push("/login");
               });
            } finally {
               setLoading(false);
            }
         }
      };
      if (status === "unauthenticated") {
         router.push("/login");
      }
      if (status === "authenticated") {
         fetchProfile();
      }
   }, [router, session, status]);

   const handlePasswordChange = (e) =>
      setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

   const handleChangePassword = async (e) => {
      e.preventDefault();
      if (!session?.backendToken) return;

      if(!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirm_newPassword) {
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

      if (passwordData.newPassword !== passwordData.confirm_newPassword) {
         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            text: "New passwords do not match.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
         });
         setPasswordData({ ...passwordData, newPassword: "", confirm_newPassword: "" });
         return;
      }

      try {
         const res = await axios.post(
            `${API}/api/auth/change-password`,
            passwordData,
            {
               headers: {
                  Authorization: `Bearer ${session.backendToken}`,
               },
            }
         );

         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            text: res.data.message || "Password changed successfully!",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
         });
         setPasswordData({ currentPassword: "", newPassword: "", confirm_newPassword: ""  });
      } catch (err) {

         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            text: err.response?.data?.message || "Failed to change password.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
         });
      }
   };

   const BackButton = () => (
      <Link href="/" passHref className="mt-6">
         <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 cursor-pointer hover:tranform hover:scale-99">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-4 w-4"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={2}>
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
               />
            </svg>
            GO BACK
         </Button>
      </Link>
   );

   if (status === "loading" || loading) {
      return <div className="text-center p-8">Loading...</div>;
   }

   if (session.user.image) {
      return (
         <>
            <BackButton />
            <div className="flex w-full mx-auto my-20 h-full gap-8 justify-center">
               <Card className="w-full max-w-md justify-center">
                  <CardHeader className="flex flex-col items-center mb-7">
                     <img
                        src={session.user.image}
                        alt="OAuth User"
                        className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                     />
                     <CardTitle className="text-teal-700">
                        {profileData.first_name} {profileData.last_name}
                     </CardTitle>
                     <CardDescription className="mt-4 text-center">
                        You are signed in with an external provider. Password
                        management is not available.
                     </CardDescription>
                  </CardHeader>
               </Card>
            </div>
         </>
      );
   }

   return (
      <>
         <BackButton />
         <div className="flex w-full mx-auto my-20 h-full gap-8 justify-center">
            <Card className="w-full max-w-md">
               <form onSubmit={handleChangePassword}>
                  <CardHeader className="flex flex-col items-center mb-7">
                     <img
                        src={"/testprofile.svg"}
                        alt="Change Password"
                        className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                     />
                     <CardTitle className="text-teal-700">
                        Change Password
                     </CardTitle>
                     <CardDescription>
                        Enter your current and new password.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                           Current Password
                        </Label>
                        <Input
                           id="currentPassword"
                           name="currentPassword"
                           type="password"
                           value={passwordData.currentPassword}
                           onChange={handlePasswordChange}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                           id="newPassword"
                           name="newPassword"
                           type="password"
                           value={passwordData.newPassword}
                           onChange={handlePasswordChange}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm_newPassword">Confirm New Password</Label>
                        <Input
                           id="confirm_newPassword"
                           name="confirm_newPassword"
                           type="password"
                           value={passwordData.confirm_newPassword}
                           onChange={handlePasswordChange}
                        />
                     </div>
                  </CardContent>
                  <CardFooter className="pt-0 mt-8">
                     <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer">
                        Change Password
                     </Button>
                  </CardFooter>
               </form>
            </Card>
         </div>
      </>
   );
};

export default ChangePassword;
