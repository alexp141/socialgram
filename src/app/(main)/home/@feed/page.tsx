import Post from "@/components/Post";
import { getNextPostsPage } from "@/lib/actions";
import { PostRow } from "@/lib/types/type-collection";

const ITEMS_PER_PAGE = 10;
export default async function FeedPage() {
  const posts: PostRow[] = await getNextPostsPage(1, 10);
  return (
    <div>
      <p className="text-center">feed page</p>
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
}
