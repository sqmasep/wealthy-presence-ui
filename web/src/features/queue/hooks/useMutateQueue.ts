import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";

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
