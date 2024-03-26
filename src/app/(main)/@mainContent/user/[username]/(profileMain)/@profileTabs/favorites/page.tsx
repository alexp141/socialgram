import Feed from "@/components/Feed";
import { getUserFavorites } from "@/lib/data";

export default async function FavoritesPage({
  params,
}: {
  params: { username: string };
}) {
  return (
    <Feed
      queryKey={["favorites", params.username]}
      queryFunction={getUserFavorites}
      initialPageParam={1}
      itemsPerPage={10}
      username={params.username}
    />
  );
}
