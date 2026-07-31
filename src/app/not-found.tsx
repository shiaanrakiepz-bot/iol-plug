import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="h-8 w-8" />
      </span>
      <p className="mt-6 font-display text-5xl font-bold tracking-tight text-primary">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We couldn't find that page. It may have moved, or the link might be incorrect.
      </p>
      <Link href="/" className="mt-6">
        <Button>
          <ArrowLeft />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
