import Feed from "@/components/Feed";
import { getNextPostsPage } from "@/lib/actions";

const ITEMS_PER_PAGE = 4;
export default async function FeedPage() {
  return (
    <div>
      <p className="text-center">Your Feed</p>
      <Feed
        queryKey="infinite-scroller"
        queryFunction={getNextPostsPage}
        initialPageParam={1}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}
