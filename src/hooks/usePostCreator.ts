import { createPost } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function usePostCreator() {
  const queryClient = useQueryClient();

  const {
    mutate: createNewPost,
    error: createNewPostError,
    status: createNewPostStatus,
  } = useMutation({
    mutationFn: ({
      formData,
      replyToId,
    }: {
      formData: FormData;
      replyToId: number | undefined;
    }) => createPost(formData, replyToId),
    onSuccess: (replyToId) => {
      //invalidate the feed from /userid
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      if (replyToId) {
        queryClient.invalidateQueries({ queryKey: ["comments", replyToId] });
      }
      toast.success("Successfully Submitted Post");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createNewPost, createNewPostError, createNewPostStatus };
}
