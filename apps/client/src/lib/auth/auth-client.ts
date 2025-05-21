import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  plugins: [adminClient()],
  fetchOptions: {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  },
  cookieOptions: {
    path: "/",
    sameSite: "lax",
  },
});
