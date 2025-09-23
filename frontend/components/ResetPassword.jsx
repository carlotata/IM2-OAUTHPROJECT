"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

const ResetPassword = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ token: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await axios.post(`${API}/api/auth/reset-password`, formData);
            setMessage(res.data.message + " Redirecting to login...");
            setTimeout(() => router.push('/login'), 3000);
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
                   alt="Reset Password"
                   className="h-20 w-20 rounded-full border-2 border-teal-500 bg-white shadow mb-4"
                />
                <CardTitle className="text-teal-700">Reset Password</CardTitle>
                <CardDescription>
                   Enter your reset token and new password.
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
                   <Label htmlFor="token">Reset Token</Label>
                   <Input
                      id="token"
                      name="token"
                      value={formData.token}
                      onChange={onChange}
                      placeholder="Paste your token here"
                      required
                   />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="newPassword">New Password</Label>
                   <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
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
                   {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                    <Link href="/forgot-password" passHref className="w-full cursor-pointer">
                        <Button variant="outline" className="w-full cursor-pointer">
                            Back to Token Request
                        </Button>
                    </Link>
             </CardFooter>
          </form>
       </Card>
    );
};

export default ResetPassword;