import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";

export function useSetActivity() {
  return useMutation({
    mutationKey: ["activity", "set"],
    mutationFn: async (id: string) => {
      const res = await api.activity["set-by-id"].$post({ json: { id } });
      return await res.json();
    },
  });
}
