import express from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import db from "../db";
import { profile, user } from "../db/schema";
import { eq } from "drizzle-orm";
import { onboardingSchema } from "../schema/onboarding";

const router = express.Router();

// Returns the user's profile
router.get("/profile", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const _user = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!_user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const _profile = await db.query.profile.findFirst({
      where: eq(profile.userId, session.user.id),
    });

    if (!_profile) {
      res.status(401).json({ error: "Profile not found" });
      return;
    }

    res.json({
      success: true,
      profile: _profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Updates the user's profile
router.post("/profile", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const validateBody = await onboardingSchema.safeParseAsync(req.body);

    if (!validateBody.success) {
      res.status(400).json({ error: validateBody.error });
      return;
    }

    const _user = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!_user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const _update = await db
      .update(profile)
      .set({
        location: validateBody.data.location,
        yearsOfExperience: validateBody.data.yearsOfExperience,
        skills: validateBody.data.skills.map(
          (skill: { value: string }) => skill.value
        ),
        preferredJobType: validateBody.data.preferredJobType,
      })
      .where(eq(profile.userId, session.user.id));

    if (!_update) {
      res.status(500).json({ error: "Failed to update profile" });
      return;
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert profile" });
    return;
  }
});

// Returns the onboarding status of the user
router.get("/onboarding", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const _user = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!_user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const checkOnboarding = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        onboardingCompleted: true,
      },
    });

    res.json({
      success: true,
      completed: checkOnboarding?.onboardingCompleted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get onboarding status" });
  }
});

// Sets the user's profile details and onboarding status
router.post("/onboarding", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const validateBody = await onboardingSchema.safeParseAsync(req.body);

    if (!validateBody.success) {
      res.status(400).json({ error: validateBody.error });
      return;
    }

    const _user = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!_user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const checkOnboarding = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        onboardingCompleted: true,
      },
    });

    if (checkOnboarding?.onboardingCompleted) {
      res.status(400).json({ error: "Onboarding already completed" });
      return;
    }

    const id = crypto.randomUUID().split("-").at(-1);

    if (!id) {
      res.status(500).json({ error: "Failed to generate id" });
      return;
    }

    const _insert = await db.insert(profile).values({
      id,
      userId: session.user.id,
      location: validateBody.data.location,
      yearsOfExperience: validateBody.data.yearsOfExperience,
      skills: validateBody.data.skills.map(
        (skill: { value: string }) => skill.value
      ),
      preferredJobType: validateBody.data.preferredJobType,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!_insert) {
      res.status(500).json({ error: "Failed to insert profile" });
      return;
    }

    await db
      .update(user)
      .set({ onboardingCompleted: true })
      .where(eq(user.id, session.user.id));

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to insert profile" });
    return;
  }
});

export default router;
