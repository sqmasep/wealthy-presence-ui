import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export function useQueue() {
  return useQuery({
    queryKey: ["queue", "get"],
    queryFn: async () => {
      const res = await api.queue.$get();
      return await res.json();
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 25,
  });
}
