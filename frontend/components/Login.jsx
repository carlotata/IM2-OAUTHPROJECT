"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   SiGithub,
   SiGoogle,
} from "react-icons/si";

const Login = ({ className, ...props }) => {
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
         const result = await signIn("credentials", {
            ...formData,
            redirect: false,
         });
         if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
         }
         router.push("/");
      } catch (err) {
         setError(
            err.response?.data?.message || "An error occurred during login."
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className={cn("flex flex-col gap-6 w-250", className)} {...props}>
         <Card className="overflow-hidden p-0 shadow-xl">
            <CardContent className="grid p-0 md:grid-cols-2">
               <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                     <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold text-teal-600">
                           Welcome back
                        </h1>
                        <p className="text-muted-foreground text-balance">
                           Login to your HICC account
                        </p>
                        {error && (
                           <p className="text-sm text-destructive mt-2">
                              {error}
                           </p>
                        )}
                     </div>
                     <div className="grid gap-3">
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
                     <div className="grid gap-3">
                        <div className="flex items-center">
                           <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                           id="password"
                           name="password"
                           type="password"
                           value={formData.password}
                           onChange={onChange}
                           required
                        />
                        <Link
                           href="/forgot-password"
                           className="text-center text-[0.7rem] underline-offset hover:underline text-muted-foreground hover:text-primary">
                           Forgot your password?
                        </Link>
                     </div>

                     <Button
                        type="submit"
                        className="bg-teal-600 w-full cursor-pointer hover:bg-teal-800 hover:scale-99 transition-transform hover:shadow-2xl"
                        disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                     </Button>
                     <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                           Or continue with
                        </span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <Button
                           variant="outline"
                           type="button"
                           className="w-full cursor-pointer hover:bg-gray-100 hover:scale-99 transition-transform hover:shadow-2xl"
                           onClick={() =>
                              signIn("github", { callbackUrl: "/" })
                           }>
                           <SiGithub />
                           GitHub
                        </Button>
                        <Button
                           variant="outline"
                           type="button"
                           className="w-full cursor-pointer hover:bg-gray-100 hover:scale-99  transition-transform hover:shadow-2xl"
                           onClick={() =>
                              signIn("google", { callbackUrl: "/" })
                           }>
                           <SiGoogle/>
                           Google
                        </Button>
                     </div>
                     <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                           href="/register"
                           className="underline underline-offset-4 text-muted-foreground hover:text-primary">
                           Sign up
                        </Link>
                     </div>
                  </div>
               </form>
               <div className="bg-muted hidden h-full md:flex flex-col items-center justify-center p-10 text-white relative">
                  <a
                     href="https://www.dicebear.com/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="block mt-4 group relative w-full">
                     <div className="absolute -top-14 left-0 w-full flex justify-center pointer-events-none z-10">
                        <span className="opacity-20 group-hover:opacity-100 transition-opacity duration-300 text-white px-4 text-base md:text-lg font-extrabold tracking-widest w-full max-w-xl text-center">
                           <span className="text-teal-400">H</span>
                           <span className="text-gray-500 font-normal">
                              ealth&nbsp;
                           </span>
                           <span className="text-teal-400">I</span>
                           <span className="text-gray-500 font-normal">
                              nitiative&nbsp;
                           </span>
                           <span className="text-teal-400">C</span>
                           <span className="text-gray-500 font-normal shadow-2xl">
                              hatbot&nbsp;
                           </span>
                           <span className="text-teal-400">C</span>
                           <span className="text-gray-500 font-normal">
                              ompanion
                           </span>
                        </span>
                     </div>
                     <img
                        className="h-64 w-64 rounded-full border-0.1 shadow-lg border-teal-500 bg-white hover:scale-105 transition-transform hover:shadow-2xl cursor-pointer mx-auto"
                        src="/avatar.svg"
                        alt="AI Assistant Avatar"
                     />
                  </a>
               </div>
            </CardContent>
         </Card>
         <div className="mt-8 text-center text-xs text-muted-foreground w-full">
            <span className="block font-semibold mb-1 tracking-wide">
               Presented by
            </span>
            <ul className="flex w-full justify-between max-w-xs mx-auto px-2">
               <li>
                  <a
                     href="https://www.facebook.com/jc.aviso.9/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="underline underline-offset-4 hover:text-primary">
                     Baydal, Lourden
                  </a>
               </li>
               <li>
                  <a
                     href="https://www.facebook.com/jc.aviso.9/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="underline underline-offset-4 hover:text-primary">
                     Aviso, John Carl
                  </a>
               </li>
               <li>
                  <a
                     href="https://www.facebook.com/jc.aviso.9/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="underline underline-offset-4 hover:text-primary">
                     Deligero, Juspher
                  </a>
               </li>
            </ul>
         </div>
      </div>
   );
};

export default Login;
