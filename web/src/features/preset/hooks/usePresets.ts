import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export function usePresets() {
  return useQuery({
    queryKey: ["presets", "get"],
    queryFn: async () => {
      const res = await api.preset.$get();
      return await res.json();
    },
  });
}
