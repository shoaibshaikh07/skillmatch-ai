"use client";

import { cn } from "@/lib/utils";
import { BriefcaseBusiness, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVIGATION = [
  {
    name: "Jobs",
    href: "/jobs",
    Icon: BriefcaseBusiness,
  },
  {
    name: "Profile",
    href: "/profile",
    Icon: User,
  },
];

export default function Navigation(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="fixed right-0 bottom-4 left-0 mx-auto flex w-max items-center justify-between gap-2 rounded-md border-2 border-primary/20 bg-white p-2 shadow-sm">
      {NAVIGATION.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "grid place-items-center gap-1 rounded-md border px-4 py-3 shadow-sm transition-opacity duration-300 hover:opacity-85",
            pathname.startsWith(item.href)
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground",
          )}
        >
          <item.Icon className="size-5" />
        </Link>
      ))}
    </div>
  );
}
