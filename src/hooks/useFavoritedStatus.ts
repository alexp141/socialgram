import { getFavoritedStatus } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useFavoritedStatus(postId: number) {
  const {
    data: hasFavoritedPost,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["favorited-status", postId],
    queryFn: () => getFavoritedStatus(postId),
  });

  return { hasFavoritedPost, error, fetchStatus };
}
