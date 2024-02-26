"use client";

import useFavoritedStatus from "@/hooks/useFavoritedStatus";
import useFavoritesCount from "@/hooks/useFavoritesCount";

import { favoritePost, unfavoritePost } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";

export default function FavoriteButton({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { favoritesCount, fetchStatus, error } = useFavoritesCount(postId);
  const { hasFavoritedPost } = useFavoritedStatus(postId, userId);
  const [localFavoriteCount, setLocalFavoriteCount] = useState<
    number | undefined
  >(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalFavoriteCount(favoritesCount);
  }, [favoritesCount]);

  async function handleFavorite() {
    await favoritePost(postId, userId);
    queryClient.invalidateQueries({ queryKey: ["favorited-status", postId] });
    setLocalFavoriteCount((curr) => curr! + 1);
  }

  async function handleUnfavorite() {
    await unfavoritePost(postId, userId);
    queryClient.invalidateQueries({ queryKey: ["favorited-status", postId] });
    setLocalFavoriteCount((curr) => curr! - 1);
  }

  if (error) {
    return <p>error</p>;
  }

  if (fetchStatus === "fetching") {
    return "...";
  }

  return (
    <div className="">
      {!hasFavoritedPost && (
        <button type="button" onClick={handleFavorite}>
          <FaRegBookmark /> <span>{localFavoriteCount}</span>
        </button>
      )}
      {hasFavoritedPost && (
        <button type="button" onClick={handleUnfavorite}>
          <FaBookmark /> <span>{localFavoriteCount}</span>
        </button>
      )}
    </div>
  );
}
