import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { queueToast } from "~/components/ui/sonner";

export function useAddToQueueById() {
  const utils = useQueryClient();

  return useMutation({
    mutationKey: ["queue", "add-by-id"],
    mutationFn: async (id: string) => {
      const res = await api.queue["add-by-id"].$post({ json: { id } });
      return await res.json();
    },
    onSuccess: async () => {
      await utils.invalidateQueries({ queryKey: ["queue", "get"] });
      queueToast("Added to queue");
    },
  });
}
