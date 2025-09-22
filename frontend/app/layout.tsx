import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const APP_NAME = "HICC";
const APP_DEFAULT_TITLE = "Health Initiative Chatbot Companion";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   applicationName: APP_NAME,
   title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
   },
   description: APP_DESCRIPTION,
   manifest: "/manifest.json",
   appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: APP_DEFAULT_TITLE,
      // startUpImage: [],
   },
   formatDetection: {
      telephone: false,
   },
   openGraph: {
      type: "website",
      siteName: APP_NAME,
      title: {
         default: APP_DEFAULT_TITLE,
         template: APP_TITLE_TEMPLATE,
      },
      description: APP_DESCRIPTION,
   },
   twitter: {
      card: "summary",
      title: {
         default: APP_DEFAULT_TITLE,
         template: APP_TITLE_TEMPLATE,
      },
      description: APP_DESCRIPTION,
   },
};

export const viewport: Viewport = {
   themeColor: "#FFFFFF",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
