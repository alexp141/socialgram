import { checkIfFollowing } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

export default function useFollowingStatus(
  userToFollowId: string,
  isAlreadyFollowing: boolean,
  currUserId?: string
) {
  const {
    data: isFollowing,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: ["following-status", userToFollowId],
    queryFn: () =>
      checkIfFollowing(userToFollowId, currUserId, isAlreadyFollowing),
  });

  return { isFollowing, error, fetchStatus };
}
