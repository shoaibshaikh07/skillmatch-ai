import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  appName: "SkillMatch",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    usePlural: false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
