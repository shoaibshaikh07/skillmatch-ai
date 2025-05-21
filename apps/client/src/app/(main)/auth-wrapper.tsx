"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthorizationWrapper({
  children,
}: { children: React.ReactNode }): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      const session = await authClient.getSession({
        fetchOptions: {
          credentials: "include",
        },
      });

      if (!session.data?.session) {
        router.push("/auth");
      }
    };
    checkSession();
  }, [router]);
  return <main>{children}</main>;
}
