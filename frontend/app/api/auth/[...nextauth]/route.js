// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const authOptions = {
   providers: [
      GitHubProvider({
         clientId: process.env.GITHUB_CLIENT_ID,
         clientSecret: process.env.GITHUB_CLIENT_SECRET,
         authorization: {
            params: {
               prompt: "select_account",
            },
         },
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         authorization: {
            params: {
               prompt: "select_account",
            },
         },
      }),
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            try {
               // 3. Call your existing backend login endpoint
               const res = await axios.post(`${API}/api/auth/login`, {
                  email: credentials.email,
                  password: credentials.password,
               });

               const user = res.data;

               // 4. If login is successful, return the user data and token
               if (user) {
                  return {
                     // NextAuth requires these fields, even if we don't use them directly
                     id: user.token,
                     name: user.email,
                     email: user.email,
                     // Your custom data that will be passed to the JWT callback
                     backendToken: user.token,
                     onboarding_complete: user.onboarding_complete,
                  };
               } else {
                  // If login fails, return null
                  return null;
               }
            } catch (error) {
               // Handle backend errors (e.g., invalid credentials)
               console.error(
                  "Credentials Auth Error:",
                  error.response?.data?.message
               );
               // Throw an error to be caught by the client-side signIn call
               throw new Error(
                  error.response?.data?.message || "Invalid credentials"
               );
            }
         },
      }),
   ],
   callbacks: {
      async signIn({ user, account }) {
         if (account.provider === "github" || account.provider === "google") {
            try {
               const { email, name } = user;
               const provider = account.provider;
               const providerAccountId = account.providerAccountId;

               // Call your backend's new OAuth endpoint
               const res = await axios.post(`${API}/api/auth/oauth`, {
                  email,
                  name,
                  provider,
                  providerAccountId,
               });

               // Attach backend token and onboarding status to the user object
               // so we can access it in the JWT callback
               user.backendToken = res.data.token;
               user.onboarding_complete = res.data.onboarding_complete;

               return true; // Continue the sign-in
            } catch (error) {
               console.error(
                  "OAuth sign-in error:",
                  error.response?.data?.message || error.message
               );
               // To send error to the client, you can redirect to an error page
               // Or return false to stop the sign-in process
               return `/login?error=${encodeURIComponent(
                  error.response?.data?.message || "OAuthError"
               )}`;
            }
         }
         return true;
      },

      async jwt({ token, user, trigger, session }) {
         // After signIn, the user object with our custom data is passed here
         if (user) {
            token.backendToken = user.backendToken;
            token.onboarding_complete = user.onboarding_complete;
         }
         if (trigger === "update") {
            console.log(
               "DEBUG: JWT update triggered. Fetching fresh profile..."
            );
            try {
               // Re-fetch the user's profile from your backend to get the latest data
               const res = await axios.get(`${API}/api/user/profile`, {
                  headers: { Authorization: `Bearer ${token.backendToken}` },
               });

               const freshProfile = res.data;

               if (freshProfile) {
                  console.log("DEBUG: Fresh profile fetched:", freshProfile);
                  // Update the token with the very latest information from the database
                  token.onboarding_complete = freshProfile.onboarding_complete;
               }
            } catch (error) {
               console.error(
                  "DEBUG: Failed to fetch fresh profile during JWT update:",
                  error
               );
               // If the fetch fails, return the old token to avoid breaking the session
               return token;
            }
         }

         return token;
      },

      async session({ session, token }) {
         // Make the custom data available in the client-side session
         if (token) {
            session.backendToken = token.backendToken;
            session.onboarding_complete = token.onboarding_complete;
         }
         return session;
      },
   },
   pages: {
      signIn: "/login",
   },
   secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
