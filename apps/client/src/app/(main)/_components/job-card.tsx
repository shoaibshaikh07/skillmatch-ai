import type { Job } from "@/lib/types/job";
import { Building, MapPin, Clock, Laptop } from "lucide-react";
import AlertDialogJobApply from "./dialog-apply";

export default function JobCard({ job }: { job: Job }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-input bg-card p-4 shadow-xs outline-none">
      <div className="flex justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg">{job.title}</h2>
          <p className="text-muted-foreground text-sm">
            <Building className="mr-1 inline size-4" />
            {job.company}
          </p>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center justify-end text-muted-foreground">
            <MapPin className="mr-1 size-4" />
            <p className="text-sm">{job.location}</p>
          </div>
          <div className="flex items-center justify-end text-muted-foreground">
            <Clock className="mr-1 size-4" />
            <p className="text-sm">
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        <Laptop className="mr-1 inline size-4" />
        {job.jobType}
      </p>
      <div className="flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <div
            key={skill}
            className="rounded-md bg-primary px-2 py-1 text-primary-foreground text-xs"
          >
            {skill}
          </div>
        ))}
      </div>
      <AlertDialogJobApply job={job} />
    </div>
  );
}
