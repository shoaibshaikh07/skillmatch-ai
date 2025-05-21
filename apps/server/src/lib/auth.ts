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
  advanced: {
    cookiePrefix: "skillmatch",
    cookieOptions: {
      secure: true,
      sameSite: "none",
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.CLIENT_BASE_URL as string],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  baseURL: process.env.CLIENT_BASE_URL,
  plugins: [admin()],
});
