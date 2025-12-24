"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInTab from "./components/sign-in-tab";
import SignUpTab from "./components/sign-up-tab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButton from "./components/social-auth-button";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import EmailVerification from "./components/email-verification";

type Tab = "signin" | "signup" | "email-verification";
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("selva@iaaxin.com");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) {
        router.push("/");
      } else {
        setLoading(false); // session does not exist → show login UI
      }
    });
  }, [router]);

  const openEmailVerification = (enmail: string) => {
    setSelectedTab("email-verification");
    setEmail(email);
  };
  if (loading) return null;
  return (
    <Tabs
      value={selectedTab}
      className="w-full max-auto my-6 px-4"
      onValueChange={(t) => setSelectedTab(t as Tab)}
    >
      {(selectedTab === "signin" || selectedTab === "signup") && (
        <TabsList>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>{" "}
        </TabsList>
      )}

      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab openEmailVerification={openEmailVerification} />
          </CardContent>

          <Separator />
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButton  />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab   openEmailVerification={openEmailVerification} />
          </CardContent>

          <Separator />
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButton />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="email-verification">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={email} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
