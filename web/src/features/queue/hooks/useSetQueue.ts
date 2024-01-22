import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export function useSetQueue() {
  return useMutation({
    mutationKey: ["queue", "set"],
    mutationFn: async (queue: string[]) => {
      const res = await api.queue["set-by-ids"].$post({ json: { ids: queue } });
      return await res.json();
    },
  });
}
