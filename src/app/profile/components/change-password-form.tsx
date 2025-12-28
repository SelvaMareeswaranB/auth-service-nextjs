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
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  revokeOtherSessions: z.boolean(),
});

type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handlePasswordChange = async (data: ChangePasswordForm) => {
  await authClient.changePassword(
    data,
{
    onError:(err)=>{
        toast.error(err.error.message || "Failed To Update Password")
    },
    onSuccess:()=>{
        toast.success("Password Updated Successfully")
    }
}
  )
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handlePasswordChange)}
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revokeOtherSessions"
          render={({ field }) => (
            <FormItem className="flex">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage /> <FormLabel>Log Out Other Sessions</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Change Password</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
