// components/Onboarding.jsx

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Make sure useRouter is imported
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL;

const Onboarding = () => {
    const router = useRouter(); // Initialize the router
    const { data: session, status, update } = useSession();
    const [formData, setFormData] = useState({ first_name: "", last_name: "", age: "" });
    const [loading, setLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session.backendToken) {
            axios.get(`${API}/api/user/profile`, {
                headers: { Authorization: `Bearer ${session.backendToken}` }
            }).then(res => {
                setFormData({
                    first_name: res.data.first_name || "",
                    last_name: res.data.last_name || "",
                    age: res.data.age || ""
                });
            }).catch(err => console.error("Failed to fetch profile for onboarding"));
        }
    }, [session, status]);

    // This effect now includes the critical cache refresh step
    useEffect(() => {
        if (status === "authenticated" && session?.onboarding_complete && !isNavigating) {
            setIsNavigating(true);
            
            // 1. CRITICAL: Purge the server-side router cache.
            // This ensures that when we navigate next, the server is forced
            // to re-run the logic in `app/page.jsx` instead of using a stale result.
            router.refresh();

            // 2. Replace the current URL. Using `replace` is slightly better
            // here as it prevents the onboarding page from being in the browser history.
            router.replace('/');
        }
    }, [session, status, isNavigating, router]); // Add `router` to the dependency array
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.backendToken) {
            setError("Authentication session not found. Please log in again.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await axios.put(`${API}/api/user/onboard`, formData, {
                headers: { Authorization: `Bearer ${session.backendToken}` }
            });
            // This simply triggers the useEffect hook to run once the session is updated.
            await update();
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
            setLoading(false);
        }
    };
    
    // ... (rest of the component is the same)
    if (status === "loading") {
        return <div className="text-center p-8">Loading session...</div>;
    }
    if (loading) {
        return <div className="text-center p-8">Saving and redirecting...</div>;
    }
    return (
       <Card className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
             <CardHeader className="flex flex-col items-center mb-7">
                <img
                   src="/avatar.svg"
                   alt="Profile Setup"
                   className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                />
                <CardTitle className="text-teal-700">
                   Complete Your Profile
                </CardTitle>
                <CardDescription>
                   Please fill in the details below to continue.
                </CardDescription>
                {error && (
                   <p className="text-sm text-destructive mt-2">{error}</p>
                )}
             </CardHeader>

             <CardContent className="space-y-4">
                <div className="space-y-2">
                   <Label htmlFor="first_name">First Name</Label>
                   <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={onChange}
                      required
                   />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="last_name">Last Name</Label>
                   <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={onChange}
                      required
                   />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="age">Age</Label>
                   <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={onChange}
                      required
                   />
                </div>
             </CardContent>

             <CardFooter className="flex-col gap-4 mt-8">
                <Button
                   type="submit"
                   className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer"
                   disabled={loading}>
                   {loading ? "Saving..." : "Save and Continue"}
                </Button>
             </CardFooter>
          </form>
       </Card>
    );
};

export default Onboarding;