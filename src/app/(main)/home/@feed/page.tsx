import Post from "@/components/Post";
import { getNextPostsPage } from "@/lib/actions";

const ITEMS_PER_PAGE = 10;
export default async function FeedPage() {
  const posts: any[] = await getNextPostsPage(1, 10);
  return (
    <div>
      <p className="text-center">feed page</p>
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
}
