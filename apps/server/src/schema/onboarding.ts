import { z } from "zod";

export const onboardingSchema = z.object({
  location: z
    .string({ required_error: "Location is required" })
    .min(2, { message: "Location must be at least 2 characters" }),
  yearsOfExperience: z
    .string({ required_error: "Experience is required" })
    .min(1, { message: "Experience is required" })
    .refine((data) => !Number.isNaN(Number(data)), {
      message: "Years of Experience must be a number",
    }),
  skills: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .array()
    .min(3, { message: "Select at least three skills" }),
  preferredJobType: z
    .string({ required_error: "Select a preferred job type" })
    .min(1, { message: "Select a preferred job type" }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
