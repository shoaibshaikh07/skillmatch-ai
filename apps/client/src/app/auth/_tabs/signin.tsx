"use client";

import { useForm } from "react-hook-form";
import { type SignInSchema, signInSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";

export default function AuthTabSignIn(): React.JSX.Element {
  const router = useRouter();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: SignInSchema): Promise<void> => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        rememberMe: true,
      },
      {
        onError: (error): void => {
          console.log(error);
          toast.error(error.error.message);
        },
        onSuccess: async (): Promise<void> => {
          toast.success("Successfully Logged In, Redirecting...");
          const response = await api.get("/user/onboarding");
          if (response.data.error) {
            toast.error("Error - Onboarding Failed");
          }

          if (!response.data.completed) {
            router.push("/onboarding");
            return;
          }

          router.push("/jobs");
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 py-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="text" placeholder="Email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4 w-full"
          isLoading={form.formState.isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}
