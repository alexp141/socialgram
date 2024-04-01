"use client";

import useFavoritedStatus from "@/hooks/useFavoritedStatus";
import useFavoritesCount from "@/hooks/useFavoritesCount";

import { favoritePost, unfavoritePost } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";

export default function FavoriteButton({ postId }: { postId: number }) {
  const { favoritesCount, fetchStatus, error } = useFavoritesCount(postId);
  const { hasFavoritedPost } = useFavoritedStatus(postId);
  const queryClient = useQueryClient();

  async function handleFavorite() {
    await favoritePost(postId);

    queryClient.invalidateQueries({ queryKey: ["favorited-count", postId] });
    queryClient.invalidateQueries({ queryKey: ["favorited-status", postId] });
  }

  async function handleUnfavorite() {
    await unfavoritePost(postId);

    queryClient.invalidateQueries({ queryKey: ["favorited-count", postId] });
    queryClient.invalidateQueries({ queryKey: ["favorited-status", postId] });
  }

  if (error) {
    return <p className="text-red-500">error</p>;
  }

  return (
    <>
      {!hasFavoritedPost && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleFavorite}
            className="flex justify-center items-center gap-1"
          >
            <FaRegBookmark />
            <span>{favoritesCount}</span>
          </button>
        </div>
      )}
      {hasFavoritedPost && (
        <div>
          <button
            type="button"
            onClick={handleUnfavorite}
            className="flex justify-center items-center gap-1 text-emerald-600"
          >
            <FaBookmark />
            <span>{favoritesCount}</span>
          </button>
        </div>
      )}
    </>
  );
}
