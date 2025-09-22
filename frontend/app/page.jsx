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

  if (!session) {
    console.error("DEBUG: Redirecting to /login because session is NULL or undefined.");
    redirect("/login");
  }

  console.log("DEBUG: Session object found:", JSON.stringify(session, null, 2));

  if (!session.onboarding_complete) {
    console.log("DEBUG: Redirecting to /onboard because session.onboarding_complete is false.");
    redirect("/onboard");
  }

  console.log("DEBUG: Onboarding check passed. Now attempting to fetch profile...");

  const user = await getProfile(session.backendToken);

  if (!user) {
    console.error("DEBUG: Redirecting to /login because getProfile(token) returned NULL.");
    redirect("/login");
  }

  console.log("DEBUG: All checks passed. Rendering homepage for user:", user.first_name);

  return (
     <div className="flex min-h-screen bg-gradient-to-b from-teal-50 to-white">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen shadow-2xl">
           <div className="flex flex-col items-center py-8">
              <img
                 src={user.image || "/avatar.svg"}
                 alt="HICC Sidebar Avatar"
                 className="h-20 w-20 rounded-full border-4 border-teal-500 bg-white shadow mb-4"
              />
              <h2 className="text-lg font-bold text-teal-700 mb-1">HICC</h2>
              <p className="text-xs text-gray-500 text-center px-2">
                 Health Initiative Chatbot Companion
              </p>
           </div>
           <nav className="flex flex-col gap-2 px-6">
              <Link href="/profile" passHref>
                 <Button
                    variant="ghost"
                    className="justify-start w-full text-left cursor-pointer">
                    <span className="mr-2">👤</span> Manage Profile
                 </Button>
              </Link>
              <Link href="/changepassword" rel="noopener noreferrer" passHref>
                 <Button
                    variant="ghost"
                    className="justify-start w-full text-left cursor-pointer">
                    <span className="mr-2">🗝️</span> Change Password
                 </Button>
              </Link>
              <Link
                 href="https://e911.gov.ph/"
                 target="_blank"
                 rel="noopener noreferrer"
                 passHref>
                 <Button
                    variant="ghost"
                    className="justify-start w-full text-left cursor-pointer">
                    <span className="mr-2">❓</span> Help
                 </Button>
              </Link>
              <Link href="/about" passHref>
                 <Button
                    variant="ghost"
                    className="justify-start w-full text-left cursor-pointer">
                    <span className="mr-2">ℹ️</span> About
                 </Button>
              </Link>
              <div className="border-t my-4" />
           </nav>
           <div className="mt-auto px-6 pb-6 text-xs justify-between flex items-center w-full">
              &copy; {new Date().getFullYear()} HICC
              <Logout /> 
           </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex flex-col flex-1 items-center justify-center w-full">
           {/* HICC Chatbot Header */}
           <div className="w-full max-w-3xl flex items-center gap-3 mb-6 px-4 mt-8 justify-center">
              <img
                 src="/avatar.svg"
                 alt="HICC Avatar"
                 className="h-12 w-12 rounded-full border-2 border-teal-500 bg-white shadow"
              />
              <div>
                 <h1 className="text-xl font-bold text-teal-700 flex items-center gap-1">
                    <span className="text-teal-500">H</span>
                    <span className="font-normal text-black">ealth&nbsp;</span>
                    <span className="text-teal-500">I</span>
                    <span className="font-normal text-black">
                       nitiative&nbsp;
                    </span>
                    <span className="text-teal-500">C</span>
                    <span className="font-normal text-black">hatbot&nbsp;</span>
                    <span className="text-teal-500">C</span>
                    <span className="font-normal text-black">ompanion</span>
                 </h1>
                 <p className="text-xs text-gray-500">
                    Welcome, {user.first_name}! You are now chatting with HICC.
                 </p>
              </div>
           </div>

           {/* Chat Window */}
           <div className="w-full max-w-[95%] flex-1 flex flex-col bg-white overflow-hidden rounded-lg shadow-lg">
              <div
                 className="flex-1 overflow-y-auto p-6 space-y-4"
                 style={{ minHeight: 300 }}>
                 {/* Example chat bubbles */}
                 <div className="flex items-start gap-3">
                    <img
                       src="/avatar.svg"
                       alt="HICC"
                       className="h-8 w-8 rounded-full border border-teal-400"
                    />
                    <div className="bg-teal-50 text-teal-900 px-4 py-2 rounded-2xl rounded-bl-none shadow max-w-xs">
                       Hi {user.first_name}, how can I assist you today?
                    </div>
                 </div>
                 <div className="flex items-start gap-3 justify-end">
                    <div className="bg-teal-600 text-white px-4 py-2 rounded-2xl rounded-br-none shadow max-w-xs ml-auto">
                       Show me my health profile.
                    </div>
                    <img
                       src={session.user.image || "/testprofile.svg"}
                       alt="You"
                       className="h-8 w-8 rounded-full border border-gray-300"
                    />
                 </div>
                 {/* Add more chat bubbles here as needed */}
              </div>
              {/* Chat Input */}
              <form className="flex items-center gap-2 border-t px-4 py-3 bg-gray-50">
                 <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    disabled
                 />
                 <Button type="submit" disabled>
                    Send
                 </Button>
              </form>
              <div className="text-xs text-gray-400 text-center py-2">
                 (Chat functionality coming soon)
              </div>
           </div>
        </main>
     </div>
  );
};

export default HomePage;