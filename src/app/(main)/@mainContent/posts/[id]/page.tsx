import DetailedPost from "@/components/DetailedPost";
import Feed from "@/components/Feed";
import { getPost } from "@/lib/actions";
import { getNextCommentsPage } from "@/lib/data";
import { hashids } from "@/lib/helper";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(+hashids.decode(params.id)[0].toString());
  let parentPost;

  if (post.reply_to_id) {
    parentPost = await getPost(post.reply_to_id);
  }

  return (
    <div className="">
      <h2 className="text-center text-xl p-2">Thread</h2>
      <DetailedPost post={post} parentPost={parentPost} />
      <Feed
        queryKey={["comments", post.id]}
        queryFunction={getNextCommentsPage}
        initialPageParam={1}
        itemsPerPage={10}
        postId={post.id}
      />
    </div>
  );
}
