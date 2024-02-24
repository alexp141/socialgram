import { getLikeStatus } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

export default function useLikeStatus(postId: number) {
  const {
    data: hasLikedPost,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["like-status", postId],
    queryFn: () => {
      return getLikeStatus(postId);
    },
  });
  return { hasLikedPost, error, fetchStatus };
}
