import { Constants } from "@/lib/constants";
import Link from "next/link";

export default function Header(): React.JSX.Element {
  return (
    <nav className="mx-auto max-w-5xl p-4">
      <div>
        <Link href="/jobs" className="font-semibold text-lg">
          {Constants.SITE_NAME}.
        </Link>
        <p className="text-muted-foreground text-sm">
          AI-Powered Job Match Platform
        </p>
      </div>
    </nav>
  );
}
