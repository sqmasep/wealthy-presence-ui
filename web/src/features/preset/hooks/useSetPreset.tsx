import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { queueToast } from "~/components/ui/sonner";

export function useSetPreset() {
  const utils = useQueryClient();

  return useMutation({
    mutationKey: ["presets", "set"],
    mutationFn: async (preset: string) => {
      const res = await api.queue["set-one"].$post({
        json: { id: preset },
      });
      return await res.json();
    },
    onSuccess: async () => {
      await utils.invalidateQueries({ queryKey: ["queue", "get"] });
      queueToast("Preset have been set");
    },
  });
}
