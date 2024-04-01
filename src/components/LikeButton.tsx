"use client";

import useLikeCount from "@/hooks/useLikeCount";
import useLikeStatus from "@/hooks/useLikeStatus";
import { likePost, unlikePost } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import LoadingSpinner from "./LoadingSpinner";

export default function LikeButton({ postId }: { postId: number }) {
  const { likeCount, fetchStatus, error } = useLikeCount(postId);
  const { hasLikedPost } = useLikeStatus(postId);
  const queryClient = useQueryClient();
  // const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    await likePost(postId);
    queryClient.invalidateQueries({ queryKey: ["like-count", postId] });
    queryClient.invalidateQueries({ queryKey: ["like-status", postId] });
  }

  async function handleDislike() {
    await unlikePost(postId);

    queryClient.invalidateQueries({ queryKey: ["like-count", postId] });
    queryClient.invalidateQueries({ queryKey: ["like-status", postId] });
  }

  if (error) {
    return <p className="text-red-500">N/A</p>;
  }

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <>
      {!hasLikedPost && (
        <div className="flex gap-1">
          <button type="button" onClick={handleLike}>
            <FaRegHeart />
          </button>
          <span>{likeCount}</span>
        </div>
      )}
      {hasLikedPost && (
        <div className="flex gap-1 text-red-600">
          <button type="button" onClick={handleDislike}>
            <FaHeart />
          </button>
          <span>{likeCount}</span>
        </div>
      )}
    </>
  );
}
