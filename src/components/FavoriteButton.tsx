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
    queryClient.invalidateQueries({ queryKey: ["favorited-status", postId] });
  }

  async function handleUnfavorite() {
    await unfavoritePost(postId);
    queryClient.invalidateQueries({ queryKey: ["favorited-status", postId] });
  }

  if (error) {
    return <p>error</p>;
  }

  return (
    <>
      {!hasFavoritedPost && (
        <div className="flex gap-1">
          <button type="button" onClick={handleFavorite}>
            <FaRegBookmark />
          </button>
          <span>{favoritesCount}</span>
        </div>
      )}
      {hasFavoritedPost && (
        <div className="flex gap-1 text-emerald-600">
          <button type="button" onClick={handleUnfavorite}>
            <FaBookmark />
          </button>
          <span>{favoritesCount}</span>
        </div>
      )}
    </>
  );
}
