"use client";

import useLikeCount from "@/hooks/useLikeCount";
import useLikeStatus from "@/hooks/useLikeStatus";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import useLike from "@/hooks/useLike";
import TinyLoader from "./TinyLoader";

export default function LikeButton({ postId }: { postId: number }) {
  const { likeCount, fetchStatus, error } = useLikeCount(postId);
  const { hasLikedPost } = useLikeStatus(postId);
  const { likePostMutation, likePostError, likePostStatus } = useLike();

  async function handleLike() {
    likePostMutation({ postId, type: "like" });
  }

  async function handleDislike() {
    likePostMutation({ postId, type: "dislike" });
  }

  if (error) {
    return <p className="text-red-500">N/A</p>;
  }

  return (
    <>
      {!hasLikedPost && (
        <div>
          <button
            type="button"
            onClick={handleLike}
            className="flex justify-center items-center gap-1"
          >
            <FaRegHeart />
            {likePostStatus !== "pending" && fetchStatus !== "fetching" ? (
              <span>{likeCount}</span>
            ) : (
              <TinyLoader style="flex" />
            )}
          </button>
        </div>
      )}
      {hasLikedPost && (
        <div>
          <button
            type="button"
            onClick={handleDislike}
            className="flex justify-center items-center gap-1 text-red-600"
          >
            <FaHeart />
            {likePostStatus !== "pending" && fetchStatus !== "fetching" ? (
              <span>{likeCount}</span>
            ) : (
              <TinyLoader style="flex" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
