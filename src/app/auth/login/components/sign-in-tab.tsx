"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PasskeyButton from "./passkey-button";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type signUpForm = z.infer<typeof signInSchema>;

export default function SignInTab({
  openEmailVerification,
  openForgotPassword
}: {
  openEmailVerification: (email: string) => void;
  openForgotPassword:()=>void
}) {
  const form = useForm<signUpForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;
  const router = useRouter();
  const handleSignUp = async (data: signUpForm) => {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerification(data.email);
          } else {
            toast.error(error.error.message || "Sign In failed");
          }
        },
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };
  return (
    <div className="space-y-4">
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field}  autoComplete="email webauthn" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Button
                onClick={openForgotPassword}
                  type="button"
                  variant={"link"}
                  size={"sm"}
                  className="text-sm font-normal underline"
                >
                  Forgot Password
                </Button>
              </div>
              <FormControl>
                <PasswordInput {...field} autoComplete="current-password webauthn" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
        </Button>
      </form>
    </Form>
    <PasskeyButton/>
    </div>
  );
}
