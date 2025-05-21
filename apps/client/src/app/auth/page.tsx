import type { Metadata } from "next";
import AuthPage from "./auth-page";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Access your SkillMatch account or create a new one to unlock AI-powered job matching capabilities.",
};

export default function Auth(): React.JSX.Element {
  return <AuthPage />;
}
