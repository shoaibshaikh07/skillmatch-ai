import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthTabSignup from "./_tabs/signup";
import AuthTabSignIn from "./_tabs/signin";
import { Constants } from "@/lib/constants";
import { Minus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Access your SkillMatch account or create a new one to unlock AI-powered job matching capabilities.",
};

export default function Auth(): React.JSX.Element {
  return (
    <section className="mt-16 flex flex-col gap-4 p-4">
      <Tabs defaultValue="signup" className="mx-auto w-[400px]">
        <h1 className="mx-auto flex items-center gap-2">
          Authentication <Minus className="inline" />{" "}
          <span className="font-medium">{Constants.SITE_NAME}</span>
        </h1>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <AuthTabSignup />
        </TabsContent>
        <TabsContent value="signin">
          <AuthTabSignIn />
        </TabsContent>
      </Tabs>
    </section>
  );
}
