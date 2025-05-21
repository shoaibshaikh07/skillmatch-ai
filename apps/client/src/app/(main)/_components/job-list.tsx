"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/lib/types/job";
import { api } from "@/lib/utils";
import { type QueryObserverResult, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import JobCard from "./job-card";
import { Sparkle } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";

type SortOption = "relevant" | "newest" | "oldest";

export default function JobList(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevant");

  const { data, isPending, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<{ jobs: Job[] }> => {
      const response = await api.get("/jobs");
      return response.data as { jobs: Job[] };
    },
  });

  const recommendJobsQuery = useQuery({
    queryKey: ["suggested-jobs"],
    queryFn: async (): Promise<{ jobs: Job[] }> => {
      const response = await api.get("/jobs/suggest");
      await new Promise((resolve) => setTimeout(resolve, 3000)); // artifical delay to show the text animation
      return response.data as { jobs: Job[] };
    },
    enabled: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const sortedAndFilteredJobs = useMemo((): Job[] => {
    if (!data?.jobs) return [];

    const filtered = data.jobs.filter((job: Job) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.jobType.toLowerCase().includes(searchLower) ||
        job.skills.some((skill: string) =>
          skill.toLowerCase().includes(searchLower),
        )
      );
    });

    return filtered.sort((a: Job, b: Job) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0; // relevant - maintain original order
      }
    });
  }, [data?.jobs, searchQuery, sortBy]);

  if (error || (!data?.jobs && !isPending)) {
    return <h2>Error: {error?.message}</h2>;
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-26 grid grid-cols-1 gap-2 space-y-2">
      <Input
        placeholder="Search jobs by title, company, location, type, or skills..."
        className="w-full"
        value={searchQuery}
        onChange={(e): void => setSearchQuery(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <Select
          value={sortBy}
          onValueChange={(value: SortOption): void => setSortBy(value)}
        >
          <SelectTrigger className="w-max">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevant">Most Relevant</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          type="button"
          onClick={(): Promise<QueryObserverResult<{ jobs: Job[] }, Error>> =>
            recommendJobsQuery.refetch()
          }
          className="bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold shadow-md"
        >
          <Sparkle className="mr-0.5 inline" />
          <span>Find My Matches</span>
        </Button>
      </div>

      {recommendJobsQuery.isFetching ? (
        <TextShimmer className="text-center font-mono text-sm" duration={3}>
          Recommending jobs according to your profile...
        </TextShimmer>
      ) : (
        recommendJobsQuery.data?.jobs &&
        recommendJobsQuery.data.jobs.length > 0 && (
          <div className="space-y-3 rounded-md bg-gradient-to-br from-blue-500 to-indigo-500 p-4">
            <div>
              <h2 className="font-semibold text-accent text-base">
                Suggested Jobs
              </h2>
              <p className="text-muted text-sm">
                These jobs are the best match for your profile.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 space-y-2">
              {recommendJobsQuery.data.jobs.map((job: Job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )
      )}

      {!sortedAndFilteredJobs || sortedAndFilteredJobs.length === 0 ? (
        <h2>No jobs found</h2>
      ) : (
        sortedAndFilteredJobs.map((job: Job) => (
          <JobCard key={job.id} job={job} />
        ))
      )}
    </div>
  );
}
