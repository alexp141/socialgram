import Feed from "@/components/Feed";
import { getUser } from "@/lib/actions";
import { getUserFavoritesUsingId } from "@/lib/data";

export default async function FavoritesPage() {
  const userId = (await getUser()).id;
  return (
    <div>
      <h2 className="text-center p-4 text-xl text-sky-500">Your Favorites</h2>
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
