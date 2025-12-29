"use client";

import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PasskeyButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  async function deleteAccount() {
    try {
      await authClient.signIn.passkey(undefined);
      refetch();
      router.push("/");
      return { error: null };
    } catch (e) {
      return {
        error: {
          message: "Failed to Delete Account",
        },
      };
    }
  }

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess() {
          refetch();
          router.push("/");
        },
      }
    );
  }, [router, refetch]);

  
  return (
    <BetterAuthActionButton
      variant={"outline"}
      className="w-full"
      successMessage="Signed In via Passkey"
      action={deleteAccount}
    >
      Use Passkey
    </BetterAuthActionButton>
  );
}
