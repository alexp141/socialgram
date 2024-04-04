import { getCommentCount } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useCommentCount(postId: number) {
  const {
    data: commentCount,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["comment-count", postId],
    queryFn: () => getCommentCount(postId),
    refetchOnWindowFocus: false,
  });

  return { commentCount, error, fetchStatus };
}
