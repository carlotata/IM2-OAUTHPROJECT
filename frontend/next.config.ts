import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
   dest: "public",
   register: true,
   reloadOnOnline: true, 
   disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
   reactStrictMode: true,
};

export default withPWA(nextConfig);
