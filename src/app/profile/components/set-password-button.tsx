"use client";

import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";

export default function SetPasswordButton({ email }: { email: string }) {
  return (
    <BetterAuthActionButton
      variant={"outline"}
      successMessage="Email Sent Successfully"
      action={async () => {
        try {
          await authClient.requestPasswordReset({
            email,
            redirectTo: "/auth/reset-password",
          });

          return { error: null };
        } catch (e) {
          return {
            error: {
              message: "Failed To Sent Email",
            },
          };
        }
      }}
    >
      Send Password Reset Mail
    </BetterAuthActionButton>
  );
}
