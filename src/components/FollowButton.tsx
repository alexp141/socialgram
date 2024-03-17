"use client";

import useFollowingStatus from "@/hooks/useFollowingStatus";
import { followUser, unfollowUser } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function FollowButton({
  userToFollow,
  currUserId,
  isAlreadyFollowing = false,
}: {
  userToFollow: string;
  currUserId?: string;
  isAlreadyFollowing?: boolean;
}) {
  const { isFollowing, error, fetchStatus } = useFollowingStatus(
    userToFollow,
    isAlreadyFollowing,
    currUserId
  );
  const queryClient = useQueryClient();
  const buttonStyle = "px-4 py-2 border rounded-full";

  async function handleFollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const res = await followUser(userToFollow);
    if (res.error) {
      console.error(res.error);
      toast.error(res.error);
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["following-status", userToFollow],
    });
    toast.success("user successfully followed");
  }

  async function handleUnfollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const res = await unfollowUser(userToFollow);
    if (res.error) {
      console.error(res.error);
      toast.error(res.error);
      return;
    }
    queryClient.invalidateQueries({
      queryKey: ["following-status", userToFollow],
    });
    toast.success("user successfully unfollowed");
  }

  if (error) {
    return <p>error</p>;
  }

  return (
    <>
      {isFollowing && (
        <button
          onClick={handleUnfollow}
          className={`${buttonStyle}`}
          disabled={fetchStatus === "fetching"}
        >
          Unfollow
        </button>
      )}
      {!isFollowing && (
        <button
          onClick={handleFollow}
          className={`${buttonStyle}`}
          disabled={fetchStatus === "fetching"}
        >
          Follow
        </button>
      )}
    </>
  );
}
