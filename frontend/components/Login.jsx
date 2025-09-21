"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// const API = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }
  }, [searchParams]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // const response = await axios.post(`${API}/api/auth/login`, formData, {
      //   withCredentials: true,
      // });
      const result = await signIn("credentials", {
        ...formData,
        redirect: false, // Tell NextAuth not to redirect automatically
      });
      if (result.error) {
        // Handle login errors returned from the authorize function
        setError(result.error);
        setLoading(false);
        return;
      }
      // window.location.href = response.data.onboarding_complete ? "/" : "/onboard";
      // if (response.data.onboarding_complete) {
        router.push("/");
      // } else {
      //   router.push("/onboard");
      // }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="flex flex-col md:flex-row items-center gap-8 p-4">
        <div className="w-full max-w-[550px] text-center md:text-left">
           <h2 className="text-5xl text-blue-600 font-black">facebook</h2>
           <p className="text-2xl mt-2">
              Connect with your friends and the world around you on Facebook.
           </p>
        </div>

        <Card className="w-full max-w-sm">
           <form onSubmit={handleSubmit}>
              <CardHeader>
                 <CardTitle className="text-2xl">Login</CardTitle>
                 <CardDescription>
                    Enter your email below to login to your account.
                 </CardDescription>
                 {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                 )}
              </CardHeader>
              <CardContent className="grid gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                       id="email"
                       name="email"
                       type="email"
                       placeholder="m@example.com"
                       value={formData.email}
                       onChange={onChange}
                       required
                    />
                 </div>
                 <div className="grid gap-2">
                    <div className="flex items-center">
                       <Label htmlFor="password">Password</Label>
                       <Link href="/forgot-password" passHref>
                          <span className="ml-auto inline-block text-sm underline">
                             Forgot your password?
                          </span>
                       </Link>
                    </div>
                    <Input
                       id="password"
                       name="password"
                       type="password"
                       value={formData.password}
                       onChange={onChange}
                       required
                    />
                 </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                 <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                 </Button>
                 <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn("github", { callbackUrl: "/" })}
                    type="button">
                    Sign in with GitHub
                 </Button>
                 <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    type="button">
                    Sign in with Google
                 </Button>
                 <hr className="w-full" />
                 <Link href="/register" passHref className="w-full">
                    <Button variant="secondary" className="w-full">
                       Create new account
                    </Button>
                 </Link>
              </CardFooter>
           </form>
        </Card>
     </div>
  );
};

export default Login;