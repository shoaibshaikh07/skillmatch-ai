import type { Metadata } from "next";
import JobList from "../_components/job-list";

export const metadata: Metadata = {
  title: "Jobs",
};

export default function Jobs(): React.JSX.Element {
  return (
    <section className="mx-auto max-w-5xl space-y-2 px-4">
      <h1 className="font-medium text-lg">Jobs</h1>
      <JobList />
    </section>
  );
}
