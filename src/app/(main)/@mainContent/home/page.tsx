import Feed from "@/components/Feed";
import { getNextPostsPage } from "@/lib/data";
const ITEMS_PER_PAGE = 4;

export default async function HomePage() {
  return (
    <div>
      <p className="text-center">Your Feed</p>
      <Feed
        queryKey={["main-feed"]}
        queryFunction={getNextPostsPage}
        initialPageParam={1}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}