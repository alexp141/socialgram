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

  if (fetchStatus === "fetching") {
    return <p>loading...</p>;
  }

  return (
    <>
      {isFollowing && <button onClick={handleUnfollow}>Unfollow</button>}
      {!isFollowing && <button onClick={handleFollow}>Follow</button>}
    </>
  );
}
