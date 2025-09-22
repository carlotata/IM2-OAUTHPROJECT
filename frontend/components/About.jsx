import React from "react";
import Link from "next/link";
import {
   SiNextdotjs,
   SiExpress,
   SiMysql,
   SiGithub,
   SiGoogle,
   SiReact,
   SiTailwindcss,
   SiJsonwebtokens,
} from "react-icons/si";

// --- Data arrays for cleaner mapping ---

const techStack = [
   { name: "Next.js", icon: <SiNextdotjs className="h-7 w-7" /> },
   { name: "React", icon: <SiReact className="h-7 w-7" /> },
   { name: "Tailwind CSS", icon: <SiTailwindcss className="h-7 w-7" /> },
   { name: "Express.js", icon: <SiExpress className="h-7 w-7" /> },
   { name: "JWT", icon: <SiJsonwebtokens className="h-7 w-7" /> },
   { name: "MySQL", icon: <SiMysql className="h-7 w-7" /> },
   { name: "NextAuth", image: "/techstack/nextauth.png" },
   { name: "GitHub OAuth", icon: <SiGithub className="h-7 w-7" /> },
   { name: "Google OAuth", icon: <SiGoogle className="h-7 w-7" /> },
];

const creators = [
   {
      name: "Baydal, Lourden",
      image: "/creators/lourden.jpg",
      url: "https://www.facebook.com/lourdenbaydal13",
   },
   {
      name: "Aviso, John Carl",
      image: "/creators/carl.jpg",
      url: "https://www.facebook.com/jc.aviso.9/",
   },
   {
      name: "Deligero, Juspher",
      image: "/creators/juspher.jpg",
      url: "https://www.facebook.com/juciper666",
   },
];

// --- The Component ---

function AboutPage() {
   return (
      // Main container to center the content on the page
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
         {/* The main content card */}
         <div className="w-full max-w-2xl rounded-xl bg-white p-8 text-center shadow-lg">
            {/* Header */}
            <div className="flex flex-col items-center">
               <img
                  src="/avatar.svg"
                  alt="HICC Logo"
                  className="mb-4 h-24 w-24 rounded-full border-4 border-teal-500"
               />
               <h1 className="text-3xl font-bold text-teal-700">About HICC</h1>
               <p className="mt-1 text-gray-600">
                  <span className="font-bold text-teal-600">H</span>ealth&nbsp;
                  <span className="font-bold text-teal-600">I</span>
                  nitiative&nbsp;
                  <span className="font-bold text-teal-600">C</span>hatbot&nbsp;
                  <span className="font-bold text-teal-600">C</span>ompanion
               </p>
               <p className="mt-4 max-w-md text-gray-500">
                  This is a simple chatbot app designed to assist you with your
                  health-related queries and provide helpful information.
               </p>
            </div>

            {/* Divider */}
            <div className="my-8 h-px w-full bg-gray-200"></div>

            {/* Tech Stack Section */}
            <div className="space-y-4">
               <h2 className="text-xl font-semibold text-gray-800">
                  Technology Stack
               </h2>
               <div className="flex flex-wrap justify-center gap-6 text-gray-500">
                  {techStack.map((tech) => (
                     // The 'group' class enables the hover effect for the child tooltip
                     <div key={tech.name} className="group relative">
                        <span className="cursor-pointer transition-transform hover:scale-110 hover:text-teal-600">
                           {tech.icon} {tech.image && <img src={tech.image} alt={tech.name} className="h-7 w-7 inline-block" />}
                        </span>
                        {/* Custom Tooltip */}
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                           {tech.name}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Divider */}
            <div className="my-8 h-px w-full bg-gray-200"></div>

            {/* Creators Section */}
            <div className="space-y-5">
               <h2 className="text-xl font-semibold text-gray-800">
                  Project Creators
               </h2>
               <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {creators.map((creator) => (
                     <div
                        key={creator.name}
                        className="flex flex-col items-center gap-2">
                        <img
                           src={creator.image}
                           alt={creator.name}
                           className="h-16 w-16 rounded-full object-cover ring-2 ring-teal-500/30"
                        />
                        <a
                           href={creator.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-sm font-medium text-gray-700 underline-offset-4 hover:text-teal-600 hover:underline">
                           {creator.name}
                        </a>
                     </div>
                  ))}
               </div>
            </div>

            {/* Footer / Go Back Button */}
            <div className="mt-10">
               <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-4 w-4"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     strokeWidth={2}>
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                     />
                  </svg>
                  Go Back
               </Link>
            </div>
         </div>
      </div>
   );
}

export default AboutPage;
