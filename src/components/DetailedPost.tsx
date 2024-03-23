import { PostRow } from "@/lib/types/type-collection";
import Image from "next/image";
import CommentButton from "./CommentButton";
import LikeButton from "./LikeButton";
import FavoriteButton from "./FavoriteButton";
import {
  convertDate,
  getAvatarImage,
  getPostImage,
  hashids,
} from "@/lib/helper";
import { getAvatar } from "@/lib/actions";
import Link from "next/link";
import CreatePost from "./CreatePost";

export default async function DetailedPost({
  post,
  parentPost,
}: {
  post: PostRow;
  parentPost?: PostRow;
}) {
  const avatarURL = await getAvatar(post.user_id);
  const avatarImg = getAvatarImage(avatarURL);
  let parentPostHashedId;

  if (parentPost) {
    parentPostHashedId = hashids.encode(parentPost.id);
  }
  let postImageURL;
  if (post.image_path) {
    postImageURL = getPostImage(post.image_path);
    console.log("post image", postImageURL);
  }

  let date = convertDate(new Date(post.created_at).toString());

  return (
    <div className="grid grid-cols-[auto_1fr] border-t border-slate-500 py-2">
      <div className="px-2">
        <Link href={`/user/${post.username}`}>
          <Image
            className="border rounded-full"
            src={avatarURL ? avatarImg : "/empty-avatar.png"}
            alt="avatar"
            width={50}
            height={50}
            placeholder="empty"
          />
        </Link>
      </div>
      <div className="">
        <div className="flex justify-between">
          @{post.username}{" "}
          {parentPost && (
            <span className="text-center text-blue-500 opacity-70 pr-2 hover:underline">
              <Link href={`/posts/${parentPostHashedId}`}>
                Replying to {parentPost.username}'s post
              </Link>
            </span>
          )}
        </div>
        <div className="my-1">{post.content}</div>
        <div>
          {postImageURL && (
            <Image
              className="border rounded-md"
              src={postImageURL}
              alt="post image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "auto", maxHeight: "30rem" }}
              placeholder="empty"
            />
          )}
          <div>{date}</div>
        </div>
        <div className="flex justify-around items-center py-2">
          <CommentButton postId={post.id} userId={post.user_id} />
          <LikeButton postId={post.id} userId={post.user_id} />
          <FavoriteButton postId={post.id} userId={post.user_id} />
          <CreatePost replyToId={post.id} />
        </div>
      </div>
    </div>
  );
}
