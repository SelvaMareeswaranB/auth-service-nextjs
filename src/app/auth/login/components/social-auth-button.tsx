"use client";

import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
} from "@/lib/auth/o-auth-providers";

export default function SocialAuthButton() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].icon;
    return (
      <BetterAuthActionButton
        variant="outline"
        key={provider}
        action={async () => {
          try {
            await authClient.signIn.social({
              provider,
              callbackURL: "/",
            });

            return { error: null };
          } catch (e) {
            return {
              error: {
                message: "Failed to start social login",
              },
            };
          }
        }}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].name}
      </BetterAuthActionButton>
    );
  });
}
