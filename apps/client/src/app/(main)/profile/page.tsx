"use client";

import { useForm } from "react-hook-form";
import {
  type OnboardingSchema,
  onboardingSchema,
} from "@/lib/schema/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiselect";
import { preferredJobType_data, skills_data } from "@/lib/data/skills";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import LocationInput from "@/app/onboarding/_components/location-input";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@/lib/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialogLogout } from "./logout-dialog";

export default function ProfilePage(): React.JSX.Element {
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      location: "",
      yearsOfExperience: "",
      skills: [],
      preferredJobType: "remote",
    },
  });

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<{ profile: Profile }> => {
      const response = await api.get("/user/profile");

      if (response.data.error) {
        toast.error(response.data.error);
      }

      if (response.data.success && response.data.profile) {
        // convert the skills (array of strings) to an array of objects
        const skills = response.data.profile.skills.map((skill: unknown) => ({
          value: skill,
          label: skill,
        }));
        form.reset(response.data.profile);
        form.setValue("skills", skills);
      }
      return response.data as { profile: Profile };
    },
  });

  if (error || (!data?.profile && !isPending)) {
    return <h2>Error: {error?.message}</h2>;
  }

  const handleSubmit = async (data: OnboardingSchema): Promise<void> => {
    const response = await api.post("/user/profile", data);

    if (response.data.error) {
      toast.error(response.data.error);
    }

    if (response.data.success) {
      toast.success("Profile updated!");
      refetch();
    }
  };

  return (
    <section className="mx-auto mt-2 flex max-w-4xl flex-col gap-4 p-4">
      <div className="mx-auto text-center">
        <h1 className="font-medium text-lg">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Ensure best job matches by updating your profile.
        </p>
      </div>

      {isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <LocationInput
              name="location"
              control={form.control}
              error={form.formState.errors.location?.message}
              placeholder="Enter your location..."
            />
            <FormField
              name="yearsOfExperience"
              control={form.control}
              render={({ field }): React.JSX.Element => (
                <FormItem>
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="1"
                    className="appearance-none "
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="skills"
              control={form.control}
              render={({ field }): React.JSX.Element => (
                <FormItem>
                  <Label htmlFor="skills">Skills</Label>
                  <MultipleSelector
                    commandProps={{
                      label: "Select frameworks",
                    }}
                    onChange={field.onChange}
                    value={field.value}
                    defaultOptions={skills_data}
                    placeholder="Select Skills"
                    hideClearAllButton
                    hidePlaceholderWhenSelected
                    emptyIndicator={
                      <p className="text-center text-sm">No results found</p>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="preferredJobType"
              control={form.control}
              render={({ field }): React.JSX.Element => (
                <FormItem>
                  <Label htmlFor="preferred-type">Preferred Job</Label>
                  <RadioGroup
                    className="grid-cols-3"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    {preferredJobType_data.map((item) => (
                      <div
                        key={`job-type-${item.value}`}
                        className="relative flex flex-col gap-4 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50"
                      >
                        <div className="flex justify-between gap-2">
                          <RadioGroupItem
                            id={`job-type-${item.value}`}
                            value={item.value}
                            className="order-1 after:absolute after:inset-0"
                          />
                          <item.icon
                            className="opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                        </div>
                        <Label
                          htmlFor={`job-type-${item.value}`}
                          className="text-sm"
                        >
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full">
              <Button
                type="submit"
                className="mx-auto w-full self-center sm:w-fit"
                isLoading={form.formState.isSubmitting}
              >
                Update
              </Button>
            </div>
          </form>
          <AlertDialogLogout />
        </Form>
      )}
    </section>
  );
}
