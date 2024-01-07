import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./api";

export const queryClient = new QueryClient();

type WealthyStatus = "run" | "stop";

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
