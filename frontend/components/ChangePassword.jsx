"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
      age: "",
      email: "",
   });
   const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
   });
   const [loading, setLoading] = useState(true);
   const [passwordError, setPasswordError] = useState("");
   const [passwordSuccess, setPasswordSuccess] = useState("");

   useEffect(() => {
      const fetchProfile = async () => {
         if (status === "authenticated" && session.backendToken) {
            try {
               const res = await axios.get(`${API}/api/user/profile`, {
                  headers: {
                     // 4. Send token in Authorization header
                     Authorization: `Bearer ${session.backendToken}`,
                  },
               });
               setProfileData(res.data);
            } catch (err) {
               setProfileError(
                  "Failed to fetch profile. Redirecting to login..."
               );
               setTimeout(() => router.push("/login"), 2000);
            } finally {
               setLoading(false);
            }
         }
         // try {
         //     const res = await axios.get(`${API}/api/user/profile`, { withCredentials: true });
         //     setProfileData(res.data);
         // } catch (err) {
         //     setProfileError("Failed to fetch profile. Redirecting to login...");
         //     setTimeout(() => router.push("/login"), 2000);
         // } finally {
         //     setLoading(false);
         // }
      };
      if (status === "unauthenticated") {
         router.push("/login");
      }
      fetchProfile();
   }, [router, session, status]);
  
   const handlePasswordChange = (e) =>
      setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

   const handleChangePassword = async (e) => {
      e.preventDefault();
      if (!session?.backendToken) return;
      setPasswordError("");
      setPasswordSuccess("");
      try {
         // const res = await axios.post(`${API}/api/auth/change-password`, passwordData, { withCredentials: true });
         const res = await axios.post(
            `${API}/api/auth/change-password`,
            passwordData,
            {
               headers: {
                  // 7. Send token for password change
                  Authorization: `Bearer ${session.backendToken}`,
               },
            }
         );
         setPasswordSuccess(res.data.message);
         setPasswordData({ currentPassword: "", newPassword: "" }); // Clear fields
      } catch (err) {
         setPasswordError(
            err.response?.data?.message || "Failed to change password."
         );
      }
  };

  const BackButton = () => {
    return (
      <Link href="/" passHref className="mt-6">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 cursor-pointer">
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
  };

   // if (loading) return <div className="text-center">Loading profile...</div>;
   if (status === "loading" || loading) {
      return <div className="text-center p-8">Loading profile...</div>;
   }
  if (session.user.image) {
     return (
     <>
        <BackButton />
        <div className="flex w-full mx-auto my-20 h-full gap-8 justify-center">
           {/* Change Password Card */}
           <Card className="w-full max-w-md justify-center">
              <form onSubmit={handleChangePassword}>
                 <CardHeader className="flex flex-col items-center mb-7">
                    <img
                       src={session.user.image || "/avatar.svg"}
                       alt="Change Password"
                       className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                    />
                    <CardTitle className="text-teal-700">
                      {profileData.first_name} {profileData.last_name}
                    </CardTitle>
                    <CardDescription  className="mt-4 text-center">
                      User is using OAuth. Password change not available.
                    </CardDescription>
                 </CardHeader>
              </form>
           </Card>
        </div>
     </>
  );
  } else {
    return (
       <>
          <BackButton />
          <div className="flex w-full mx-auto my-20 h-full gap-8 justify-center">
             {/* Change Password Card */}
             <Card className="w-full max-w-md">
                <form onSubmit={handleChangePassword}>
                   <CardHeader className="flex flex-col items-center mb-7">
                      <img
                         src={session.user.image || "/testprofile.svg"}
                         alt="Change Password"
                         className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                      />
                      <CardTitle className="text-teal-700">
                         Change Password
                      </CardTitle>
                      <CardDescription>
                         Enter your current and new password.
                      </CardDescription>
                      {passwordSuccess && (
                         <p className="text-sm text-green-600 mt-2">
                            {passwordSuccess}
                         </p>
                      )}
                      {passwordError && (
                         <p className="text-sm text-destructive mt-2">
                            {passwordError}
                         </p>
                      )}
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
                            required
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
                            required
                         />
                      </div>
                   </CardContent>
                   <CardFooter className="pt-0 mt-8">
                      <Button
                         type="submit"
                         disabled={session.user.image}
                         className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer">
                         Change Password
                      </Button>
                   </CardFooter>
                </form>
             </Card>
          </div>
       </>
    );
  }

};

export default ChangePassword;
