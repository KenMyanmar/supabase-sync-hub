import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getRecentLiveUpdates } from "@/lib/site-content.functions";

export function useLivePill() {
  const fn = useServerFn(getRecentLiveUpdates);
  const { data } = useQuery({
    queryKey: ["site", "live-updates", "recent"],
    queryFn: () => fn(),
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
  return { hasLive: Array.isArray(data) && data.length > 0 };
}
