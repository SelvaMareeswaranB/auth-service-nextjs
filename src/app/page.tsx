import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <main>
      sigin page
      <Button asChild size={"lg"}>
  <Link href="/auth">Sign up and Sign In</Link>
      </Button>
    </main>
  );
}
