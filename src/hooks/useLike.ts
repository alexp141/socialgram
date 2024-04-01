import { likePost } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useLike() {
  const queryClient = useQueryClient();

  const {
    mutate: likePostMutation,
    error: likePostError,
    status: likePostStatus,
  } = useMutation({
    mutationFn: ({ postId }: { postId: number }) => likePost(postId),
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["like-count", postId] });
      queryClient.invalidateQueries({ queryKey: ["like-status", postId] });
    },
    onError: (error, variables, context) => {
      toast.error(error.message);
    },
  });

  return { likePostMutation, likePostError, likePostStatus };
}
