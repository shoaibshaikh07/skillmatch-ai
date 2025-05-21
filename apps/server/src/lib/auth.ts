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
  },
  baseURL: process.env.CLIENT_BASE_URL,
  plugins: [admin()],
});
