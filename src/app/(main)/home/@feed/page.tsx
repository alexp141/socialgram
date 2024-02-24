import InfiniteScroller from "@/components/InfiniteScroller";

const ITEMS_PER_PAGE = 10;
export default async function FeedPage() {
  return (
    <div>
      <p className="text-center">feed page</p>
      <InfiniteScroller />
    </div>
  );
}
