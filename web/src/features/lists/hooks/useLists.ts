import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export function useLists() {
  return useQuery({
    queryKey: ["lists", "get"],
    queryFn: async () => {
      const res = await api.lists.$get();
      return await res.json();
    },
  });
}
