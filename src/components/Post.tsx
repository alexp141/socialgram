"use client";
import { PostRow } from "@/lib/types/type-collection";
import Image from "next/image";
import LikeButton from "./LikeButton";
import FavoriteButton from "./FavoriteButton";
import CommentButton from "./CommentButton";
import Link from "next/link";
import { useMemo, useState } from "react";
import { hashids } from "@/lib/helper";
import useAvatar from "@/hooks/useAvatar";

export default function Post({ post }: { post: PostRow }) {
  const { avatar_url, error, fetchStatus } = useAvatar(post.user_id);
  let postImageURL;

  if (post.image_path) {
    postImageURL = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/post_images/${post.image_path}`;
    console.log("post image", postImageURL);
  }
  const avatar = `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/profile/${avatar_url}`;

  const hashedPostId = useMemo(() => {
    return hashids.encode(post.id);
  }, [post.id]);

  return (
    <div className="grid grid-cols-[auto_1fr] border-t border-red-500 py-2 px-1">
      <div className="">
        <Image
          className="border rounded-full"
          src={avatar_url ? avatar : "/empty-avatar.png"}
          alt="avatar"
          width={50}
          height={50}
          placeholder="empty"
        />
      </div>
      <div className="flex flex-col">
        <Link href={`/${post.username}`}>{`@${post.username}`}</Link>
        <Link href={`/posts/${hashedPostId}`}>
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
          </div>
        </Link>
        <div className="flex border justify-around items-center py-2">
          <CommentButton postId={post.id} userId={post.user_id} />
          <LikeButton postId={post.id} userId={post.user_id} />
          <FavoriteButton postId={post.id} userId={post.user_id} />
        </div>
      </div>
    </div>
  );
}
