"use client";

import { useForm } from "react-hook-form";
import { type SignUpSchema, signUpSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthTabSignup(): React.JSX.Element {
  const router = useRouter();
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (formData: SignUpSchema): Promise<void> => {
    await authClient.signUp.email(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        onError: (error): void => {
          console.log(error);
          toast.error(error.error.message);
        },
        onSuccess: async (): Promise<void> => {
          toast.success("Sign Up Successful, Redirecting...");
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
          name="name"
          control={form.control}
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Name" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
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
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
