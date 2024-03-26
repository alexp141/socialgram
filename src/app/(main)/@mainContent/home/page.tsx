import Feed from "@/components/Feed";
import { getNextPostsPage, getNextPostsPageFollowingOnly } from "@/lib/data";
const ITEMS_PER_PAGE = 10;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { feed: string | null | undefined };
}) {
  return (
    <div>
      {!searchParams.feed ||
      (searchParams.feed && searchParams.feed === "forYou") ? (
        <Feed
          queryKey={["main-feed"]}
          queryFunction={getNextPostsPage}
          initialPageParam={1}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      ) : (
        <Feed
          queryKey={["following-feed"]}
          queryFunction={getNextPostsPageFollowingOnly}
          initialPageParam={1}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
}
