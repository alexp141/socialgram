"use client";

import { favoritePost, unfavoritePost } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useFavorite() {
  const queryClient = useQueryClient();

  const {
    mutate: favoriteMutation,
    error: favoriteError,
    status: favoriteStatus,
  } = useMutation({
    mutationFn: ({
      postId,
      type,
    }: {
      postId: number;
      type: "favorite" | "unfavorite";
    }) => (type === "favorite" ? favoritePost(postId) : unfavoritePost(postId)),
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["favorited-count", postId] });
      queryClient.invalidateQueries({ queryKey: ["favorited-status", postId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { favoriteMutation, favoriteError, favoriteStatus };
}
