"use client";
import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function InvitiationInformation({
  invitation,
}: {
  invitation: { id: string; organizationId: string };
}) {
  const router = useRouter();

  async function acceptInvite() {
    try {
      await authClient.organization.acceptInvitation(
        { invitationId: invitation.id },
        {
          onSuccess: async () => {
            await authClient.organization.setActive({
              organizationId: invitation.organizationId,
            });
            router.push("/organizations");
          },
        }
      );

      return { error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: { message: err.message } };
      }

      return {
        error: { message: "Failed to accept invitation" },
      };
    }
  }

  async function rejectInvite() {
    const res = await authClient.organization.rejectInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: () => router.push("/"),
      }
    );

    return {
      error: res.error
        ? { message: res.error.message ?? "Failed to reject invitation" }
        : null,
    };
  }

  return (
    <div className="flex gap-4">
      <BetterAuthActionButton className="grow" action={acceptInvite}>
        Accept
      </BetterAuthActionButton>

      <BetterAuthActionButton
        className="grow"
        variant="destructive"
        action={rejectInvite}
      >
        Reject
      </BetterAuthActionButton>
    </div>
  );
}
