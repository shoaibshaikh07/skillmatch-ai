import express from "express";
import type { Request, Response } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import db from "../db";
import { job, type Profile, profile } from "../db/schema";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { voyageai } from "../lib/voyageai";

const router = express.Router();

// Returns a list of jobs
router.get("/", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const _jobs = await db.query.job.findMany({});

    if (!_jobs) {
      res.status(402).json({ error: "Failed to get jobs" });
      return;
    }

    res.json({
      success: true,
      jobs: _jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Returns a list of 3 suggested jobs based on the user's profile
router.get("/suggest", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const _profile = await db.query.profile.findFirst({
      where: eq(profile?.userId, session.user.id),
    });

    if (!_profile) {
      res.status(401).json({ error: "profile not found" });
      return;
    }

    const _jobs = await getJobRecommendations(_profile);

    res.json({
      success: true,
      jobs: _jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

// Returns a list of 3 most relevant jobs based on the user's profile
async function getJobRecommendations(userProfile: Profile): Promise<
  {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    skills: string[] | null;
    similarity: number;
  }[]
> {
  const profileEmbeddingInput = `
    Desired Job Type: ${userProfile.preferredJobType}
    Years of Experience: ${userProfile.yearsOfExperience} years
    Location: ${userProfile.location}
    Skills: ${userProfile.skills?.join(", ")}
  `.trim();

  const getEmbedding = await voyageai.embed({
    model: "voyage-3-large",
    input: profileEmbeddingInput,
  });

  const embeddings = getEmbedding.data?.[0].embedding;
  if (!embeddings) {
    return [];
  }

  const similarity = sql<number>`1 - (${cosineDistance(job.embedding, embeddings)})`;
  const similarJobs = await db
    .select({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      skills: job.skills,
      createdAt: job.createdAt,
      applicationClosed: job.applicationClosed,
      similarity,
    })
    .from(job)
    .where(and(gt(similarity, 0.7), eq(job.applicationClosed, false)))
    .orderBy((t) => desc(t.similarity))
    .limit(3);

  return similarJobs;
}
