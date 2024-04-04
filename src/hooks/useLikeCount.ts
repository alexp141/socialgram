import { getPostLikes } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useLikeCount(postId: number) {
  const {
    data: likeCount,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["like-count", postId],
    queryFn: () => getPostLikes(postId),
    refetchOnWindowFocus: false,
    //refetchOnMount: "always",
  });

  return { likeCount, error, fetchStatus };
}
