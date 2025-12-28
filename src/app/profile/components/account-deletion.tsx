"use client";

import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";

export default function AccountDeletion() {
  async function deleteAccount() {
    try {
      await authClient.deleteUser();

      return { error: null };
    } catch (e) {
      return {
        error: {
          message: "Failed to Delete Account",
        },
      };
    }
  }
  return (
    <BetterAuthActionButton
      variant={"destructive"}
      requireAreYouSure
      className="w-full"
      successMessage="Account deletion initated.Please Check your email to confirm"
      action={deleteAccount}
    >
        Delete Account Permanently
    </BetterAuthActionButton>
  );
}
