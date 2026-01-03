"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export default function OrganizationSelect() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations === null || organizations.length === 0) return null;

  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      { organizationId },
      {
        onError: (error) => {
          toast.error(error.error.message || "failed to switch organization");
        },
      }
    );
  }
  return (
    <Select
      value={activeOrganization?.id ?? ""}
      onValueChange={setActiveOrganization}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => {
          return (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
