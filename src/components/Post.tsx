"use client";
import { PostRow } from "@/lib/types/type-collection";
import { FaRegBookmark } from "react-icons/fa6";
import Image from "next/image";
import LikeButton from "./LikeButton";
import useLikeCount from "@/hooks/useLikeCount";
import useLikeStatus from "@/hooks/useLikeStatus";
import FavoriteButton from "./FavoriteButton";
import CommentButton from "./CommentButton";

export default function Post({ post }: { post: PostRow }) {
  let postImageURL;
  if (post.image_path) {
    postImageURL = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/post_images/${post.image_path}`;
    console.log("post image", postImageURL);
  }

  return (
    <div className="grid grid-cols-[auto_1fr] border-t border-red-500 py-2 px-1">
      <div className="">
        <div className="w-12 h-12 bg-orange-500 border rounded-full mx-1"></div>
      </div>
      <div className="flex flex-col">
        <div>@name</div>
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
              style={{ width: "95%", height: "auto" }}
              placeholder="empty"
            />
          )}
        </div>
        <div className="flex border justify-around items-center py-2">
          <CommentButton postId={post.id} userId={post.user_id} />
          <LikeButton postId={post.id} userId={post.user_id} />
          <FavoriteButton postId={post.id} userId={post.user_id} />
        </div>
      </div>
    </div>
  );
}
