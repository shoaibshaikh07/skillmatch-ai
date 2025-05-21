"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthTabSignup from "./_tabs/signup";
import AuthTabSignIn from "./_tabs/signin";
import { Constants } from "@/lib/constants";
import { Minus } from "lucide-react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";

export default function AuthPage(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const checkSteps = async (): Promise<void> => {
      const session = await authClient.getSession({
        fetchOptions: {
          credentials: "include",
        },
      });

      if (session.data?.session) {
        const onboardingStatus = await api.get("/user/onboarding");
        if (!onboardingStatus.data.completed) {
          router.push("/onboarding");
          return;
        }
        router.push("/jobs");
      }
    };

    checkSteps();
  }, []);

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
