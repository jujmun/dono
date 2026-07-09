import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function useCurrentProfile() {
  return useQuery(api.users.me);
}

export function useUpdateProfile() {
  return useMutation(api.users.updateProfile);
}

export function useBootstrapAdmin() {
  return useMutation(api.users.bootstrapFirstAdmin);
}
