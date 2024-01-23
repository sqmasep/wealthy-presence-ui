import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./api";

export const queryClient = new QueryClient();

type WealthyStatus = "start" | "stop";

export function useStatus() {
  return useQuery({
    queryKey: ["status", "get"],
    queryFn: async () => {
      const res = await api.status.$get();
      return await res.json();
    },
  });
}

export function useMutateStatus() {
  const utils = useQueryClient();

  return useMutation({
    mutationKey: ["status", "mutate"],
    mutationFn: async (status: WealthyStatus) => {
      if (status === "start") {
        const res = await api.status.$post({ json: { action: "start" } });
        return await res.json();
      }

      const res = await api.status.$post({ json: { action: "stop" } });
      return await res.json();
    },
    onSuccess: async () => {
      await utils.invalidateQueries({ queryKey: ["status", "get"] });
    },
  });
}
