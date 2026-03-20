import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

// Query hooks

export function useGetActiveNewsEvents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["newsEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveNewsEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllNotices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotices();
    },
    enabled: !!actor && !isFetching,
  });
}

// Mutation hooks

export function useSubmitContactForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      subject,
      message,
    }: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitContactForm(name, email, phone, subject, message);
    },
  });
}

export function useSubmitAdmissionEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      applicantName,
      email,
      phone,
      programOfInterest,
    }: {
      applicantName: string;
      email: string;
      phone: string;
      programOfInterest: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitAdmissionEnquiry(
        applicantName,
        email,
        phone,
        programOfInterest,
      );
    },
  });
}
