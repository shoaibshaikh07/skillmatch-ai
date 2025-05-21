import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "SkillMatch",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  baseURL: "http://localhost:3001",
  trustedOrigins: [process.env.CLIENT_BASE_URL as string],
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    cookiePrefix: "skillmatch",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      httpOnly: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  plugins: [admin()],
});
