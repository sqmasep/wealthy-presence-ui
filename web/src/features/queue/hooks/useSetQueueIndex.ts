import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export function useSetQueueIndex() {
  return useMutation({
    mutationKey: ["queue", "setIndex"],
    mutationFn: async (index: number) => {
      const res = await api.queue["set-index"].$post({ json: { index } });

      return await res.json();
    },
  });
}
