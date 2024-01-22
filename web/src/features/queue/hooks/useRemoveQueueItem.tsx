import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { queueToast } from "~/components/ui/sonner";

export function useRemoveQueueItem() {
  const utils = useQueryClient();

  return useMutation({
    mutationKey: ["queue", "remove"],
    mutationFn: async (id: string) => {
      const res = await api.queue["remove-by-id"].$delete({ json: { id } });
      return res;
    },
    onSuccess: async () => {
      await utils.invalidateQueries({ queryKey: ["queue", "get"] });
      queueToast("Queue item removed");
    },
  });
}
