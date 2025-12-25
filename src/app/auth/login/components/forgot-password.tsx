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
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

type forgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword({
  openSignInTab,
}: {
  openSignInTab: () => void;
}) {
  const form = useForm<forgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const isSubmitting = form.formState.isSubmitting;
  const forgotPassword = async (data: forgotPasswordForm) => {
    await authClient.requestPasswordReset(
      {
        ...data,
        redirectTo: "/auth/reset-password",
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send password reset mail"
          );
        },
        onSuccess: () => {
          toast.success("Password reset mail sent");
        },
      }
    );
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(forgotPassword)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="button" variant={"outline"} onClick={openSignInTab}>
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            <LoadingSwap isLoading={isSubmitting}>Send Reset Email</LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
