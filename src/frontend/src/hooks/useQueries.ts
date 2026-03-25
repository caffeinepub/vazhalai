import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CateringService,
  ContactInquiry,
  Gender,
  MatrimonyProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useGetCateringServices() {
  const { actor, isFetching } = useActor();
  return useQuery<CateringService[]>({
    queryKey: ["cateringServices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActiveCateringServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMatrimonyProfiles(
  community?: string,
  location?: string,
  gender?: Gender,
) {
  const { actor, isFetching } = useActor();
  return useQuery<MatrimonyProfile[]>({
    queryKey: ["matrimonyProfiles", community, location, gender],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterMatrimonyProfiles(
        community || null,
        location || null,
        gender || null,
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContactInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInquiry[]>({
    queryKey: ["contactInquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContactInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (inquiry: ContactInquiry) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContactInquiry(inquiry);
    },
  });
}

export function useAddCateringService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (service: CateringService) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCateringService(service);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cateringServices"] }),
  });
}

export function useUpdateCateringService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      service,
    }: { id: bigint; service: CateringService }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCateringService(id, service);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cateringServices"] }),
  });
}

export function useDeleteCateringService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCateringService(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cateringServices"] }),
  });
}

export function useAddMatrimonyProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: MatrimonyProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMatrimonyProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matrimonyProfiles"] }),
  });
}

export function useUpdateMatrimonyProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      profile,
    }: { id: bigint; profile: MatrimonyProfile }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMatrimonyProfile(id, profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matrimonyProfiles"] }),
  });
}

export function useDeleteMatrimonyProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMatrimonyProfile(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["matrimonyProfiles"] }),
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
