"use client";
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = process.env.NEXT_PUBLIC_API_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
            console.log(res.data.resetToken);
            setMessage(`Reset token logged!`);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
       <Card className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
             <CardHeader className="flex flex-col items-center mb-7">
                <img
                   src="/avatar.svg"
                   alt="Forgot Password"
                   className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                />
                <CardTitle className="text-teal-700">Forgot Password</CardTitle>
                <CardDescription>
                   Enter your email to receive a password reset token.
                </CardDescription>
                {message && (
                   <p className="text-sm text-green-600 mt-2">{message}</p>
                )}
                {error && (
                   <p className="text-sm text-destructive mt-2">{error}</p>
                )}
             </CardHeader>

             <CardContent className="space-y-4">
                <div className="space-y-2">
                   <Label htmlFor="email">Email</Label>
                   <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                   />
                </div>
             </CardContent>

             <CardFooter className="flex-col gap-4 mt-8 cursor-pointer">
                <Button
                   type="submit"
                   className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer"
                   disabled={loading}>
                   {loading ? "Sending..." : "Get Reset Token"}
                </Button>
                <Link
                   href="/reset-password"
                   passHref
                   className="w-full cursor-pointer">
                   <Button
                      variant="outline"
                      className="w-full text-white bg-teal-600 hover:bg-teal-700 cursor-pointer hover:text-white">
                      I have a token
                   </Button>
                </Link>
                <Link href="/login" passHref className="w-full cursor-pointer">
                   <Button variant="outline" className="w-full cursor-pointer">
                      Back to Log-in
                   </Button>
                </Link>
             </CardFooter>
          </form>
       </Card>
    );
};

export default ForgotPassword;