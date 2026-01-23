/**
 * Better Auth Client Configuration
 * For use in frontend
 */

import { createAuthClient } from "better-auth/react";
import { env } from "@suite/env";

export const authClient = createAuthClient({
  baseURL: env.VITE_PUBLIC_SITE_URL,
  basePath: "/api/auth",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useUser,
} = authClient;
