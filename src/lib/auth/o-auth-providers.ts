import { DiscordIcon, GitHubIcon } from "@/components/auth/o-auth-icons";
import { ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDERS = ["discord", "github"] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; icon: ElementType<ComponentProps<"svg">> }
> = {
  discord: {
    name: "Discord",
    icon: DiscordIcon,
  },
  github: {
    name: "GitHub",
    icon: GitHubIcon,
  },
};
