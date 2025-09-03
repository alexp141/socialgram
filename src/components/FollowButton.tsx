"use client";

import useFollow from "@/hooks/useFollow";
import useFollowingStatus from "@/hooks/useFollowingStatus";
import { useState } from "react";
import { Button } from "./ui/button";

export default function FollowButton({
  userToFollow,
  currUserId,
}: {
  userToFollow: string;
  currUserId?: string;
}) {
  const { isFollowing, error, fetchStatus } = useFollowingStatus(
    userToFollow,
    currUserId
  );
  const { followMutation, followError, followStatus } = useFollow();

  const buttonStyle = "bg-sky-300 text-black dark:text-white";

  async function handleFollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    followMutation({ userId: userToFollow, type: "follow" });
  }

  async function handleUnfollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    followMutation({ userId: userToFollow, type: "unfollow" });
  }

  if (error) {
    return <p>error</p>;
  }

  return (
    <div className="">
      {isFollowing && (
        <Button
          variant={"outline"}
          onClick={handleUnfollow}
          className={`${buttonStyle}`}
          disabled={fetchStatus === "fetching" || followStatus === "pending"}
        >
          {fetchStatus === "fetching" || followStatus === "pending"
            ? "Loading..."
            : "Unfollow"}
        </Button>
      )}
      {!isFollowing && (
        <Button
          onClick={handleFollow}
          className={`${buttonStyle}`}
          disabled={fetchStatus === "fetching" || followStatus === "pending"}
        >
          {fetchStatus === "fetching" || followStatus === "pending"
            ? "Loading..."
            : "Follow"}
        </Button>
      )}
    </div>
  );
}
