import CommentCreator from "@/components/CommentCreator";
import DetailedPost from "@/components/DetailedPost";
import InfiniteScrollerComments from "@/components/InfiniteScrollerComments";
import { getPost } from "@/lib/actions";
import { hashids } from "@/lib/helper";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(hashids.decode(params.id)[0].toString());

  return (
    <div className="md:min-w-[35rem] lg:max-w-[40rem] border-x border-red-500">
      <p>post page</p>
      <DetailedPost post={post} />
      <CommentCreator post={post} />
      <InfiniteScrollerComments postId={post.id} />
    </div>
  );
}
