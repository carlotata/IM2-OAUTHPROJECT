// app/page.jsx (with debugging)

import { redirect } from "next/navigation";
import Link from "next/link";
import Logout from "@/components/Logout";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

// Modified getProfile to log errors
const getProfile = async (token) => {
  if (!token) {
    console.error("DEBUG: getProfile failed because token is missing.");
    return null;
  }
  try {
    const res = await axios.get(`${API}/api/user/profile`, {
      headers: {
        Cookie: `token=${token}`,
        Authorization: `Bearer ${token}`, // Send both for good measure
      },
    });
    console.log("DEBUG: getProfile successful.");
    return res.data;
  } catch (error) {
    console.error("DEBUG: getProfile FAILED. Axios error:", error.response?.data || error.message);
    return null;
  }
};

const HomePage = async () => {
  console.log("\n--- DEBUG: Homepage Server Component Execution ---");

  const session = await getServerSession(authOptions);

  // Check #1: Is the session object itself valid?
  if (!session) {
    console.error("DEBUG: Redirecting to /login because session is NULL or undefined.");
    redirect("/login");
  }

  // Log the contents of the session object
  console.log("DEBUG: Session object found:", JSON.stringify(session, null, 2));

  // Check #2: Is the onboarding flag correct in the session?
  if (!session.onboarding_complete) {
    console.log("DEBUG: Redirecting to /onboard because session.onboarding_complete is false.");
    redirect("/onboard");
  }

  console.log("DEBUG: Onboarding check passed. Now attempting to fetch profile...");

  // Check #3: Does the getProfile call succeed?
  const user = await getProfile(session.backendToken);

  if (!user) {
    console.error("DEBUG: Redirecting to /login because getProfile(token) returned NULL.");
    redirect("/login");
  }

  console.log("DEBUG: All checks passed. Rendering homepage for user:", user.first_name);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user.first_name}!
        </h1>
        <p className="text-gray-600 mb-6">
          You have successfully logged in.
        </p>
        <div className="flex justify-center items-center gap-4">
          <Link href="/profile" passHref>
            <Button>Manage Profile</Button>
          </Link>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default HomePage;