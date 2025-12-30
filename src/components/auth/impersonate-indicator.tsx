"use client";

import { authClient } from "@/lib/auth/auth-client";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import BetterAuthActionButton from "./better-auth-action-button";

export function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (!session?.session.impersonatedBy) return null;

  async function stopImpersonationAction() {
    try {
      await authClient.admin.stopImpersonating();
      router.push("/admin");
      refetch();
      return { error: null };
    } catch {
      return {
        error: {
          message: "Failed to stop impersonating",
        },
      };
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <BetterAuthActionButton
        action={stopImpersonationAction}
        successMessage="Stopped impersonating"
        variant="destructive"
        size="sm"
      >
        <UserX className="size-4" />
      </BetterAuthActionButton>
    </div>
  );
}
