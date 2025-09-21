import Profile from "@/components/Profile";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <Profile />
            <Link href="/" passHref>
                <Button>Go to Homepage</Button>
            </Link>
        </div>
    );
};

export default ProfilePage;