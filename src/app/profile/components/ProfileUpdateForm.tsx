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
import { useRouter } from "next/navigation";

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickName: z.string().min(1, "nick name required"),
  email: z.string().email("Invalid email"),
});

type profileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfileUpdateForm({
  user,
}: {
  user: {
    email: string;

    name: string;

    nickName: string;
  };
}) {
  const form = useForm<profileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  const isSubmitting = form.formState.isSubmitting;
  const router = useRouter();

  const handleUpdateProfile = async (data: profileUpdateForm) => {
    const promises = [
      authClient.updateUser({ name: data.name, nickName: data.nickName }),
    ];

    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile",
        })
      );
    }

    const result = await Promise.all(promises);
    const updateUserResult = result[0];
    const changeEmailResult = result[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || "Failed To Update Profile");
    } else if (changeEmailResult.error) {
      toast.error(changeEmailResult.error.message || "Failed to update email");
    } else {
      if (data.email !== user.email) {
        toast.success("Verify your email to complete the email change");
      } else {
        toast.success("Profiel Update Successfully");
      }
    }
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleUpdateProfile)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nick Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
