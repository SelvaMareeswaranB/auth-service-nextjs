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
import ForgotPassword from "./components/forgot-password";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
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

  const openEmailVerification = (email: string) => {
    setSelectedTab("email-verification");
    setEmail(email);
  };
  if (loading) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Tabs value={selectedTab} onValueChange={(t) => setSelectedTab(t as Tab)}>
        {(selectedTab === "signin" || selectedTab === "signup") && (
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        )}

        {/* SIGN UP */}
        <TabsContent value="signup">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Sign Up
              </CardTitle>
            </CardHeader>

            <CardContent>
              <SignUpTab openEmailVerification={openEmailVerification} />
            </CardContent>

            <Separator />

            <CardFooter className="grid grid-cols-2 gap-3">
              <SocialAuthButton />
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SIGN IN */}
        <TabsContent value="signin">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Sign In
              </CardTitle>
            </CardHeader>

            <CardContent>
              <SignInTab
                openEmailVerification={openEmailVerification}
                openForgotPassword={() => setSelectedTab("forgot-password")}
              />
            </CardContent>

            <Separator />

            <CardFooter className="grid grid-cols-2 gap-3">
              <SocialAuthButton />
            </CardFooter>
          </Card>
        </TabsContent>

        {/* EMAIL VERIFICATION */}
        <TabsContent value="email-verification">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Verify Your Email
              </CardTitle>
            </CardHeader>

            <CardContent>
              <EmailVerification email={email} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FORGOT PASSWORD */}
        <TabsContent value="forgot-password">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Forgot Password
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ForgotPassword openSignInTab={() => setSelectedTab("signin")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
