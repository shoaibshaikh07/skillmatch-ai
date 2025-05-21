import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Job } from "@/lib/types/job";
import { Building, Clock, Laptop, MapPin, Sparkle } from "lucide-react";

export default function AlertDialogJobApply({
  job,
}: {
  job: Job;
}): React.JSX.Element {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="mt-2 self-end"
          disabled={job.applicationClosed}
          size="sm"
          variant={job.applicationClosed ? "destructive" : "default"}
        >
          {job.applicationClosed ? "Closed" : "Apply Now"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apply for {job.title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <AlertDialogContentTooltip tooltip="Company">
              <h2 className="flex items-center gap-2">
                <Building className="size-4" /> {job.company}
              </h2>
            </AlertDialogContentTooltip>
            <AlertDialogContentTooltip tooltip="Location">
              <h2 className="flex items-center gap-2">
                <MapPin className="size-4" /> {job.location}
              </h2>
            </AlertDialogContentTooltip>
            <AlertDialogContentTooltip tooltip="Job Type">
              <h2 className="flex items-center gap-2">
                <Laptop className="size-4" /> {job.jobType}
              </h2>
            </AlertDialogContentTooltip>
            <AlertDialogContentTooltip tooltip="Skills">
              <h2 className="flex items-center gap-2">
                <Sparkle className="size-4" /> {job.skills.join(", ")}
              </h2>
            </AlertDialogContentTooltip>
            <span className="flex items-center gap-2">
              <Clock className="size-4" />{" "}
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Apply</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AlertDialogContentTooltip({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}): React.JSX.Element {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="block">{children}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
