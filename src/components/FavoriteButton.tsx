"use client";

import useFavorite from "@/hooks/useFavorite";
import useFavoritedStatus from "@/hooks/useFavoritedStatus";
import useFavoritesCount from "@/hooks/useFavoritesCount";

import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import TinyLoader from "./TinyLoader";

export default function FavoriteButton({ postId }: { postId: number }) {
  const { favoritesCount, fetchStatus, error } = useFavoritesCount(postId);
  const { hasFavoritedPost } = useFavoritedStatus(postId);
  const { favoriteMutation, favoriteError, favoriteStatus } = useFavorite();

  async function handleFavorite() {
    favoriteMutation({ postId, type: "favorite" });
  }

  async function handleUnfavorite() {
    favoriteMutation({ postId, type: "unfavorite" });
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
            {favoriteStatus !== "pending" && fetchStatus !== "fetching" ? (
              <span>{favoritesCount}</span>
            ) : (
              <TinyLoader style="flex" />
            )}
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
            {favoriteStatus !== "pending" && fetchStatus !== "fetching" ? (
              <span>{favoritesCount}</span>
            ) : (
              <TinyLoader style="flex" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
