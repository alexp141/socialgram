import { getAvatar } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useAvatar(userId: string) {
  const {
    data: avatar_url,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["avatar", userId],
    queryFn: () => {
      return getAvatar(userId);
    },
  });

  return { avatar_url, error, fetchStatus };
}
