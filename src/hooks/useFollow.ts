import { followUser, unfollowUser } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useFollow() {
  const queryClient = useQueryClient();
  const {
    mutate: followMutation,
    error: followError,
    status: followStatus,
  } = useMutation({
    mutationFn: ({
      userId,
      type,
    }: {
      userId: string;
      type: "follow" | "unfollow";
    }) => (type === "follow" ? followUser(userId) : unfollowUser(userId)),
    onSuccess: (userToFollowId) => {
      queryClient.invalidateQueries({
        queryKey: ["following-status", userToFollowId],
      });
      queryClient.invalidateQueries({
        queryKey: ["following-feed"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { followMutation, followError, followStatus };
}
