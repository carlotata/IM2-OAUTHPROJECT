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

const Profile = () => {
   const router = useRouter();
   const { data: session, status } = useSession();
   const [profileData, setProfileData] = useState({
      first_name: "",
      last_name: "",
      age: "",
      email: "",
   });
   const [loading, setLoading] = useState(true);
   const [profileError, setProfileError] = useState("");
   const [profileSuccess, setProfileSuccess] = useState("");

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

   const handleProfileChange = (e) =>
      setProfileData({ ...profileData, [e.target.name]: e.target.value });

   const handleUpdateProfile = async (e) => {
      e.preventDefault();
      if (!session?.backendToken) return;
      setProfileError("");
      setProfileSuccess("");
      try {
         // const res = await axios.put(`${API}/api/user/profile`, profileData, { withCredentials: true });
         const res = await axios.put(`${API}/api/user/profile`, profileData, {
            headers: {
               // 6. Send token for profile update
               Authorization: `Bearer ${session.backendToken}`,
            },
         });

         setProfileSuccess(res.data.message);
      } catch (err) {
         setProfileError(
            err.response?.data?.message || "Failed to update profile."
         );
      }
   };

   // if (loading) return <div className="text-center">Loading profile...</div>;
   if (status === "loading" || loading) {
      return <div className="text-center p-8">Loading profile...</div>;
   }

   return (
      <>
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
         <div className="flex w-full mx-auto my-20 h-full gap-8 justify-center">
            {/* Profile Update Card */}
            <Card className="w-full max-w-md">
               <form onSubmit={handleUpdateProfile}>
                  <CardHeader className="flex flex-col items-center mb-7">
                     <img
                        src={session.user.image || "/testprofile.svg"}
                        alt="Profile Avatar"
                        className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                     />
                     <CardTitle className="text-teal-700">
                        Update Profile
                     </CardTitle>
                     <CardDescription>
                        Manage your personal information.
                     </CardDescription>
                     {profileSuccess && (
                        <p className="text-sm text-green-600 mt-2">
                           {profileSuccess}
                        </p>
                     )}
                     {profileError && (
                        <p className="text-sm text-destructive mt-2">
                           {profileError}
                        </p>
                     )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="first_name">First Name</Label>
                           <Input
                              id="first_name"
                              name="first_name"
                              value={profileData.first_name}
                              onChange={handleProfileChange}
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="last_name">Last Name</Label>
                           <Input
                              id="last_name"
                              name="last_name"
                              value={profileData.last_name}
                              onChange={handleProfileChange}
                              required
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                           id="age"
                           name="age"
                           type="number"
                           value={profileData.age}
                           onChange={handleProfileChange}
                           required
                        />
                     </div>
                     <div className="space-y-2 cursor-not-allowed">
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           name="email"
                           value={profileData.email}
                           readOnly
                           disabled
                        />
                     </div>
                  </CardContent>
                  <CardFooter className="pt-0 mt-8">
                     <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer">
                        Update Profile
                     </Button>
                  </CardFooter>
               </form>
            </Card>
         </div>
      </>
   );
};

export default Profile;
