import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";

export default function Home(): React.JSX.Element {
  return (
    <section className="mx-auto flex max-w-lg flex-col gap-4 p-4 md:max-w-4xl">
      <h1 className="font-medium text-2xl">
        <span>
          AI will <span className="font-bold">take</span> your job
        </span>{" "}
        <X className="inline-block text-red-500" />
        <br />{" "}
        <span>
          AI will <span className="font-bold">help</span> you find a job
        </span>{" "}
        <Check className="inline-block text-green-600" />
      </h1>
      <p className="text-lg text-muted-foreground">
        SkillMatch is an AI-powered job match platform that connects job seekers
        with suitable job opportunities.
      </p>
      <Link href="/jobs">
        <Button className="group w-fit">
          <span>Get Started</span>
          <span className="group-hover:-rotate-45 transition-transform duration-300">
            <ArrowRight />
          </span>
        </Button>
      </Link>
    </section>
  );
}
