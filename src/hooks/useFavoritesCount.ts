import { getPostFavorites } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useFavoritesCount(postId: number) {
  const {
    data: favoritesCount,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["favorited-count", postId],
    queryFn: () => getPostFavorites(postId),
    refetchOnWindowFocus: false,
  });

  return { favoritesCount, error, fetchStatus };
}
