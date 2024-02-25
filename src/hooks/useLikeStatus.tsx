import { getLikeStatus } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useLikeStatus(postId: number) {
  const {
    data: hasLikedPost,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["like-status", postId],
    queryFn: () => getLikeStatus(postId),
  });

  return { hasLikedPost, error, fetchStatus };
}
