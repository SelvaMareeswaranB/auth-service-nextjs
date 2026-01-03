"use client";
import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Home() {
  const [hasAdminPermisson, setHasAdminPermisson] = useState(false);
  const { data: session, isPending: loading } = authClient.useSession();
  useEffect(() => {
    authClient.admin
      .hasPermission({
        permission: { user: ["list"] },
      })
      .then(({ data }) => {
        setHasAdminPermisson(data?.success ?? false);
      });
  }, []);
  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session === null ? (
          <>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <Button asChild size={"lg"}>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">
              Welcome {session?.user?.name}
            </h1>
            <div className="flex gap-4 justify-center">
              <Button asChild size={"lg"}>
                <Link href={"/profile"}>Profile</Link>
              </Button>
              {hasAdminPermisson && (
                <Button variant={"outline"} asChild size={"lg"}>
                  <Link href={"/admin"}>Admin</Link>
                </Button>
              )}
    
                <Button variant={"outline"} asChild size={"lg"}>
                  <Link href={"/organizations"}>organization</Link>
                </Button>
            
              <BetterAuthActionButton
                size={"lg"}
                variant={"destructive"}
                successMessage="Signed out successfully"
                action={async () => {
                  try {
                    await authClient.signOut();

                    return { error: null };
                  } catch (e) {
                    return {
                      error: {
                        message: "Failed to sign out",
                      },
                    };
                  }
                }}
              >
                Sign Out
              </BetterAuthActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
