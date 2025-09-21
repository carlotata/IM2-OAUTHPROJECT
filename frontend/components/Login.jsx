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
                        <h1 className="text-2xl font-bold text-teal-700">
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
                           className="text-center text-[0.7rem] underline-offset hover:underline">
                           Forgot your password?
                        </Link>
                     </div>

                     <Button
                        type="submit"
                        className="bg-teal-700 w-full cursor-pointer hover:bg-teal-800 hover:scale-99 transition-transform hover:shadow-2xl"
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
                           className="w-full cursor-pointer hover:bg-gray-200 hover:scale-101 transition-transform hover:shadow-2xl"
                           onClick={() =>
                              signIn("github", { callbackUrl: "/" })
                           }>
                           <svg
                              className="mr-2 h-4 w-4"
                              role="img"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg">
                              <title>GitHub</title>
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                           </svg>
                           GitHub
                        </Button>
                        <Button
                           variant="outline"
                           type="button"
                           className="w-full cursor-pointer hover:bg-gray-200 hover:scale-101 transition-transform hover:shadow-2xl"
                           onClick={() =>
                              signIn("google", { callbackUrl: "/" })
                           }>
                           <svg
                              className="mr-2 h-4 w-4"
                              role="img"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg">
                              <title>Google</title>
                              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.854 3.187-1.787 4.133-1.147 1.147-2.933 2.4-5.11 2.4-4.333 0-7.733-3.5-7.733-7.733s3.4-7.733 7.733-7.733c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.133H12.48z" />
                           </svg>
                           Google
                        </Button>
                     </div>
                     <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                           href="/register"
                           className="underline underline-offset-4">
                           Sign up
                        </Link>
                     </div>
                  </div>
               </form>
               <div className="bg-muted relative hidden h-full md:flex flex-col items-center justify-center p-10 text-white">
                  <h1 className="text-center text-2xl mb-8">
                     <span className="text-teal-600 font-bold">H</span>
                     <span className="text-black font-normal">ealth&nbsp;</span>
                     <span className="text-teal-600 font-bold">I</span>
                     <span className="text-black font-normal">
                        nitiative&nbsp;
                     </span>
                     <span className="text-teal-600 font-bold">C</span>
                     <span className="text-black font-normal">
                        hatbot&nbsp;
                     </span>
                     <span className="text-teal-600 font-bold">C</span>
                     <span className="text-black font-normal">ompanion</span>
                  </h1>
                  <a
                     href="https://www.dicebear.com/"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="block mt-4">
                     <img
                        className="h-64 w-64 rounded-full shadow-lg border-4 border-teal-500 bg-white hover:scale-105 transition-transform hover:shadow-2xl cursor-pointer"
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
