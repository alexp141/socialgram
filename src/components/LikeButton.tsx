"use client";

import useLikeCount from "@/hooks/useLikeCount";
import useLikeStatus from "@/hooks/useLikeStatus";
import { likePost } from "@/lib/actions";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function LikeButton({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { likeCount, fetchStatus } = useLikeCount(postId);
  const { hasLikedPost, error } = useLikeStatus(postId);

  async function handleLike() {
    await likePost(postId, userId);
  }

  return (
    <div className="">
      <button type="button" onClick={handleLike}>
        {!hasLikedPost && (
          <>
            <FaRegHeart /> {likeCount}
          </>
        )}
        {hasLikedPost && (
          <>
            <FaHeart /> {likeCount}
          </>
        )}
      </button>
    </div>
  );
}
