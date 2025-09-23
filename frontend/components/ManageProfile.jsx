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

const Profile = () => {
   const router = useRouter();
   const { data: session, status } = useSession();
   const [profileData, setProfileData] = useState({
      first_name: "",
      last_name: "",
      age: "",
      email: "",
   });

   const [initialProfileData, setInitialProfileData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchProfile = async () => {
         if (status === "authenticated" && session.backendToken) {
            try {
               const res = await axios.get(`${API}/api/user/profile`, {
                  headers: {
                     Authorization: `Bearer ${session.backendToken}`,
                  },
               });
               setProfileData(res.data);
               // Store the initial data when fetched
               setInitialProfileData(res.data);
            } catch (err) {
               Swal.fire({
                  icon: "error",
                  title: "Failed to fetch profile",
                  text: "You will be redirected to the login page.",
                  timer: 2000,
                  showConfirmButton: false,
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

   const handleProfileChange = (e) =>
      setProfileData({ ...profileData, [e.target.name]: e.target.value });

   const handleUpdateProfile = async (e) => {
      e.preventDefault();
      if (!session?.backendToken) return;

      if (JSON.stringify(profileData) === JSON.stringify(initialProfileData)) {
         Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            text: "No changes to save.",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
         });
         return; 
      }
      try {
         const res = await axios.put(`${API}/api/user/profile`, profileData, {
            headers: {
               Authorization: `Bearer ${session.backendToken}`,
            },
         });

         setInitialProfileData(profileData);

         Swal.fire({
            position: "top-end",
            toast: true,
            icon: "success",
            text: "Profile Updated!",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            text: res.data.message || "Your information has been saved.",
         });
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "Update Failed",
            text:
               err.response?.data?.message || "An unexpected error occurred.",
         });
      }
   };

   if (status === "loading" || loading) {
      return <div className="text-center p-8">Loading profile...</div>;
   }

   return (
      <>
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
         <div className="flex w-full mx-auto my-20 h-full gap-8 justify-center">
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
                     {/* Success and error messages are now handled by Swal */}
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="first_name">First Name</Label>
                           <Input
                              id="first_name"
                              name="first_name"
                              value={profileData.first_name || ""}
                              onChange={handleProfileChange}
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="last_name">Last Name</Label>
                           <Input
                              id="last_name"
                              name="last_name"
                              value={profileData.last_name || ""}
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
                           value={profileData.age || ""}
                           onChange={handleProfileChange}
                           required
                        />
                     </div>
                     <div className="space-y-2 cursor-not-allowed">
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           name="email"
                           value={profileData.email || ""}
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
