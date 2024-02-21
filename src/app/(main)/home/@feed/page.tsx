import Post from "@/components/Post";
import { getNextPostsPage } from "@/lib/actions";

const ITEMS_PER_PAGE = 10;
export default async function FeedPage() {
  const posts = await getNextPostsPage(1, 10);
  return (
    <div>
      <p className="text-center">feed page</p>
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  );
}
