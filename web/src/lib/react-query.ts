import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./api";

export const queryClient = new QueryClient();

type WealthyStatus = "run" | "stop";

export function usePresets() {
  return useQuery({
    queryKey: ["presets", "get"],
    queryFn: async () => {
      const res = await api["all-presets"].$get();
      return await res.json();
    },
  });
}

export function useSetPreset() {
  const utils = useQueryClient();

  return useMutation({
    mutationKey: ["presets", "set"],
    mutationFn: async (preset: string) => {
      const res = await api["set-preset"].$post({
        json: { id: preset },
      });
      return await res.json();
    },
    onSuccess: async () => {
      await utils.invalidateQueries({ queryKey: ["queue", "get"] });
    },
  });
}

export function useQueue() {
  return useQuery({
    queryKey: ["queue", "get"],
    queryFn: async () => {
      const res = await api.queue.$get();
      return await res.json();
    },
  });
}

export function useMutateQueue() {
  const utils = useQueryClient();

  return useMutation({
    mutationKey: ["queue", "mutate"],
    mutationFn: async (id: string) => {
      const res = await api.queue.$post({ json: { id } });
      await utils.invalidateQueries({ queryKey: ["queue", "get"] });
      return await res.json();
    },
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ["status", "get"],
    queryFn: async () => {
      const res = await api["is-running"].$get();
      return await res.json();
    },
  });
}

export function useMutateStatus() {
  const utils = useQueryClient();

  return useMutation({
    mutationKey: ["status", "mutate"],
    mutationFn: async (status: WealthyStatus) => {
      if (status === "run") {
        const res = await api.run.$post();
        return await res.json();
      }

      const res = await api.stop.$post();
      return await res.json();
    },
    onSuccess: async () => {
      await utils.invalidateQueries({ queryKey: ["status", "get"] });
    },
  });
}
