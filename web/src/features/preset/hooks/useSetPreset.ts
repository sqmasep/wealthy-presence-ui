import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";

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
