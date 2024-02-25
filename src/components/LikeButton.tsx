"use client";

import { likePost, unlikePost } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function LikeButton({
  postId,
  userId,
  likeCount,
  hasLikedPost,
}: {
  postId: number;
  userId: string;
  likeCount: number | undefined;
  hasLikedPost: boolean | undefined;
}) {
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const queryClient = useQueryClient();

  async function handleLike() {
    await likePost(postId, userId);
    queryClient.invalidateQueries({ queryKey: ["like-status", postId] });
    setLocalLikeCount((curr) => curr! + 1);
  }

  async function handleDislike() {
    await unlikePost(postId, userId);
    queryClient.invalidateQueries({ queryKey: ["like-status", postId] });
    setLocalLikeCount((curr) => curr! - 1);
  }

  return (
    <div className="">
      {!hasLikedPost && (
        <button type="button" onClick={handleLike}>
          <FaRegHeart /> {localLikeCount}
        </button>
      )}
      {hasLikedPost && (
        <button type="button" onClick={handleDislike}>
          <FaHeart /> {localLikeCount}
        </button>
      )}
    </div>
  );
}
