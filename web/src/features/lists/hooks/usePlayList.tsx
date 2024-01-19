import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { listToast } from "~/components/ui/sonner";

export default function usePlayList() {
  const utils = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.lists.play.$post({ json: { id } });

      return res;
    },
    onSuccess: async () => {
      await utils.invalidateQueries({ queryKey: ["queue", "get"] });
      listToast("Playlist started");
    },
  });
}
