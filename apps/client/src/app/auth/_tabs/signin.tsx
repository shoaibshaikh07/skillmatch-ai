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
    try {
      console.log("SignIn - Attempting login..."); // Debug log
      const response = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: true,
        },
        {
          onError: (error): void => {
            console.error("SignIn - Error:", error); // Debug log
            toast.error(error.error.message);
          },
          onSuccess: async (response): Promise<void> => {
            console.log("SignIn - Success response:", response); // Debug log
            console.log("SignIn - Cookies after login:", document.cookie); // Debug log
            toast.success("Successfully Logged In, Redirecting...");
            router.push("/jobs");
          },
        },
      );
      console.log("SignIn - Full response:", response); // Debug log
    } catch (error) {
      console.error("SignIn - Unexpected error:", error); // Debug log
      toast.error("An unexpected error occurred");
    }
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
