import Feed from "@/components/Feed";
import { getUser } from "@/lib/actions";
import { getUserFavoritesUsingId } from "@/lib/data";

export default async function FavoritesPage() {
  const userId = await (await getUser()).id;
  return (
    <div>
      <p>Your Favorites</p>
      <Feed
        queryKey={["favorites", userId]}
        queryFunction={getUserFavoritesUsingId}
        initialPageParam={1}
        itemsPerPage={4}
        userId={userId}
      />
    </div>
  );
}
