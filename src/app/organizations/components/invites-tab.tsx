"use client";
import BetterAuthActionButton from "@/components/auth/better-auth-action-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth/auth-client";
import React from "react";
import CreateInviteButton from "./create-invite-button";

export default function InvitesTab() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const pendingInvites = activeOrganization?.invitations.filter(
    (invite) => invite.status === "pending"
  );

  function cancelInvitation(invitationId: string) {
    return async () => {
      const res = await authClient.organization.cancelInvitation({
        invitationId,
      });

      return {
        error: res.error
          ? { message: res.error.message ?? "Failed to cancel invitation" }
          : null,
      };
    };
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateInviteButton />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingInvites?.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>{invitation.role}</TableCell>
              <TableCell>
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <BetterAuthActionButton
                  requireAreYouSure
                  variant="destructive"
                  size="sm"
                  action={cancelInvitation(invitation.id)}
                >
                  Cancel
                </BetterAuthActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
