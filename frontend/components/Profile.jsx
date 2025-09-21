"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL;

const Profile = () => {
    const router = useRouter();
    const { data: session, status } = useSession(); 
    const [profileData, setProfileData] = useState({ first_name: "", last_name: "", age: "", email: "" });
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
    const [loading, setLoading] = useState(true);
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");


    useEffect(() => {
        const fetchProfile = async () => {

            if (status === "authenticated" && session.backendToken){
                 try{
                    const res = await axios.get(`${API}/api/user/profile`, { headers: {
                             // 4. Send token in Authorization header
                            Authorization: `Bearer ${session.backendToken}`
                        } });
                        setProfileData(res.data);
                 } catch (err) {
                    setProfileError("Failed to fetch profile. Redirecting to login...");
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

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

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
                    Authorization: `Bearer ${session.backendToken}`
                }
            });

            setProfileSuccess(res.data.message);
        } catch (err) {
            setProfileError(err.response?.data?.message || "Failed to update profile.");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!session?.backendToken) return;
        setPasswordError("");
        setPasswordSuccess("");
        try {
            // const res = await axios.post(`${API}/api/auth/change-password`, passwordData, { withCredentials: true });
            const res = await axios.post(`${API}/api/auth/change-password`, passwordData, {
                 headers: {
                    // 7. Send token for password change
                    Authorization: `Bearer ${session.backendToken}`
                }
            });
            setPasswordSuccess(res.data.message);
            setPasswordData({ currentPassword: "", newPassword: "" }); // Clear fields
        } catch (err) {
            setPasswordError(err.response?.data?.message || "Failed to change password.");
        }
    };

    // if (loading) return <div className="text-center">Loading profile...</div>;
      if (status === "loading" || loading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <form onSubmit={handleUpdateProfile}>
                    <CardHeader>
                        <CardTitle>Update Profile</CardTitle>
                        <CardDescription>Manage your personal information.</CardDescription>
                         {profileSuccess && <p className="text-sm text-green-600 mt-2">{profileSuccess}</p>}
                         {profileError && <p className="text-sm text-destructive mt-2">{profileError}</p>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input id="first_name" name="first_name" value={profileData.first_name} onChange={handleProfileChange} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input id="last_name" name="last_name" value={profileData.last_name} onChange={handleProfileChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" name="age" type="number" value={profileData.age} onChange={handleProfileChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={profileData.email} readOnly disabled />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Update Profile</Button>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                 <form onSubmit={handleChangePassword}>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Enter your current and new password.</CardDescription>
                        {passwordSuccess && <p className="text-sm text-green-600 mt-2">{passwordSuccess}</p>}
                        {passwordError && <p className="text-sm text-destructive mt-2">{passwordError}</p>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Change Password</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Profile;