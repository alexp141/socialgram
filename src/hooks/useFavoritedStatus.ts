import { getFavoritedStatus } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useFavoritedStatus(postId: number, userId: string) {
  const {
    data: hasFavoritedPost,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["favorited-status", postId],
    queryFn: () => getFavoritedStatus(postId, userId),
  });

  return { hasFavoritedPost, error, fetchStatus };
}
