"use client";
import { PostRow } from "@/lib/types/type-collection";
import Image from "next/image";
import LikeButton from "./LikeButton";
import FavoriteButton from "./FavoriteButton";
import CommentButton from "./CommentButton";
import Link from "next/link";
import { useMemo } from "react";
import { getAvatarImage, getPostImage, hashids } from "@/lib/helper";
import useAvatar from "@/hooks/useAvatar";

export default function Post({ post }: { post: PostRow }) {
  const { avatar_url, error, fetchStatus } = useAvatar(post.user_id);
  const avatar = getAvatarImage(avatar_url);
  let postImageURL;

  if (post.image_path) {
    postImageURL = getPostImage(post.image_path);
    console.log("post image", postImageURL);
  }

  const hashedPostId = useMemo(() => {
    return hashids.encode(post.id);
  }, [post.id]);

  return (
    <div className=" hover:bg-zinc-300 hover:bg-opacity-20 dark:bg-transparent">
      <Link href={`/posts/${hashedPostId}`}>
        <div className="grid grid-cols-[auto_1fr] border-t border-zinc-900 dark:border-t-zinc-100 py-2 px-2">
          <div className="">
            <Link href={`/user/${post.username}`}>
              <Image
                className="border-2 rounded-full border-sky-400"
                src={avatar_url ? avatar : "/empty-avatar.png"}
                alt="avatar"
                width={50}
                height={50}
                placeholder="empty"
              />
            </Link>
          </div>
          <div className="ml-1">
            <Link href={`/user/${post.username}`}>
              <span className="hover:text-sky-500 text-lg text-sky-500 font-medium">{`@${post.username}`}</span>
            </Link>
            <Link href={`/posts/${hashedPostId}`}>
              <div className="my-1">{post.content}</div>
              <div className="">
                {postImageURL && (
                  <Image
                    className="border rounded-md w-auto max-h-[30rem] object-contain"
                    src={postImageURL}
                    alt="post image"
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                )}
              </div>
            </Link>
          </div>
        </div>
      </Link>
      <div className="flex justify-evenly items-center py-2 mt-2">
        <CommentButton postId={post.id} />
        <LikeButton postId={post.id} />
        <FavoriteButton postId={post.id} />
      </div>
    </div>
  );
}
