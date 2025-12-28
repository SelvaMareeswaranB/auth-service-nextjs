"use client";
import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
  SupportedOAuthProvider,
} from "@/lib/auth/o-auth-providers";
import { Plus, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];
export default function AccountLinking({
  currentAccounts,
}: {
  currentAccounts: Account[];
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Linked Accounts</h3>
        {currentAccounts.length === 0 ? (
          <Card className="py-8 text-center text-secondary-muted">
            <CardContent>No Linked Accouns Found.</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentAccounts.map((account) => (
              <AccountCard
                key={account.id}
                provider={account.providerId}
                account={account}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Link Other Accounts</h3>
        <div className="grid gap-3">
          {SUPPORTED_OAUTH_PROVIDERS.filter(
            (provider) =>
              !currentAccounts.find((acc) => acc.providerId === provider)
          ).map((provider) => (
            <AccountCard key={provider} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountCard({
  provider,
  account,
}: {
  provider: string;
  account?: Account;
}) {
  const router = useRouter();
  const providerDetails = SUPPORTED_OAUTH_PROVIDERS_DETAILS[
    provider as SupportedOAuthProvider
  ] ?? {
    name: provider,
    icon: Shield,
  };

  async function unlinkAccount() {
    if (!account) {
      return {
        error: {
          message: "Account not found",
        },
      };
    }

    try {
      await authClient.unlinkAccount(
        {
          accountId: account.accountId,
          providerId: provider,
        },
        {
          onSuccess: () => {
            router.refresh();
          },
        }
      );

      return { error: null };
    } catch (e) {
      return {
        error: {
          message: "Failed to unlink account",
        },
      };
    }
  }

  async function linkAccount() {
    try {
      await authClient.linkSocial({
        provider,
        callbackURL: "/profile",
      });

      return { error: null };
    } catch (e) {
      return {
        error: {
          message: "Failed to link account",
        },
      };
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {<providerDetails.icon className="size-5" />}
            <div>
              <p className="font-medium">{providerDetails.name}</p>
              {account == null ? (
                <p className="text-sm text-muted-foreground">
                  Connect your {providerDetails.name} account for easier sign-in
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {account == null ? (
            <BetterAuthActionButton
              variant="outline"
              size="sm"
              action={linkAccount}
              successMessage="Account Linked Successfully"
            >
              <Plus />
              Link
            </BetterAuthActionButton>
          ) : (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={unlinkAccount}
              successMessage="Account Unlinked Successfully"
            >
              <Trash2 />
              Unlink
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
