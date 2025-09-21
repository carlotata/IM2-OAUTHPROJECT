"use client";
import ResetPassword from "@/components/ResetPassword";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
       <Suspense fallback={<div>Loading...</div>}>
         <ResetPassword />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;