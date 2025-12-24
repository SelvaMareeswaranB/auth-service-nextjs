import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import React, { useEffect, useRef, useState } from "react";

export default function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(0);
  const interval = useRef<NodeJS.Timeout>(undefined);

  function startEmailVerificationCountDown(time = 30) {
    if (interval.current) {
      clearInterval(interval.current);
    }

    setTimeToNextResend(time);

    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        if (t <= 1) {
          clearInterval(interval.current);
          interval.current = undefined;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }
  useEffect(() => {
    startEmailVerificationCountDown();
  }, []);
  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);
  return (
    <div className="space-y-4 ">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verification link.Please check your email and click the
        link to verifiy your account
      </p>
      <BetterAuthActionButton
        variant="outline"
        className="w-full"
        successMessage="Verification email send"
        disabled={timeToNextResend > 0}
        action={async () => {
          try {
            await authClient.sendVerificationEmail({
              email,
              callbackURL: "/",
            });
            startEmailVerificationCountDown(30);
            return { error: null };
          } catch (e) {
            return {
              error: {
                message: "Verification Failed",
              },
            };
          }
        }}
      >
        {timeToNextResend > 0
          ? `Resend Email (${timeToNextResend})`
          : "Resend Email"}
      </BetterAuthActionButton>
    </div>
  );
}
