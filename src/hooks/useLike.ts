"use client";

import { likePost, unlikePost } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useLike() {
  const queryClient = useQueryClient();

  const {
    mutate: likePostMutation,
    error: likePostError,
    status: likePostStatus,
  } = useMutation({
    mutationFn: ({
      postId,
      type,
    }: {
      postId: number;
      type: "like" | "dislike";
    }) => (type === "like" ? likePost(postId) : unlikePost(postId)),
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["like-count", postId] });
      queryClient.invalidateQueries({ queryKey: ["like-status", postId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { likePostMutation, likePostError, likePostStatus };
}
