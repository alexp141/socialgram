"use client";

import useLikeCount from "@/hooks/useLikeCount";
import useLikeStatus from "@/hooks/useLikeStatus";
import { likePost, unlikePost } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function LikeButton({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { likeCount, fetchStatus, error } = useLikeCount(postId);
  const { hasLikedPost } = useLikeStatus(postId);
  const [localLikeCount, setLocalLikeCount] = useState<number | undefined>(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalLikeCount(likeCount);
  }, [likeCount]);

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

  if (error) {
    return <p>error</p>;
  }

  if (fetchStatus === "fetching") {
    return "...";
  }

  return (
    <div className="">
      {!hasLikedPost && (
        <button type="button" onClick={handleLike}>
          <FaRegHeart /> <span>{localLikeCount}</span>
        </button>
      )}
      {hasLikedPost && (
        <button type="button" onClick={handleDislike}>
          <FaHeart /> <span>{localLikeCount}</span>
        </button>
      )}
    </div>
  );
}
