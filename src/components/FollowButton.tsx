"use client";

import useFollow from "@/hooks/useFollow";
import useFollowingStatus from "@/hooks/useFollowingStatus";
import { useState } from "react";

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

  const buttonStyle =
    "px-4 py-2 border-2 rounded-full border-sky-50 hover:bg-sky-700 bg-sky-400 text-sky-50";

  async function handleFollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    followMutation(
      { userId: userToFollow, type: "follow" },
    );
  }

  async function handleUnfollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    followMutation(
      { userId: userToFollow, type: "unfollow" },
    );
  }

  if (error) {
    return <p>error</p>;
  }

  return (
    <div className="">
      {isFollowing && (
        <button
          onClick={handleUnfollow}
          className={`${buttonStyle}`}
          disabled={fetchStatus === "fetching" || followStatus === "pending"}
        >
          {fetchStatus === "fetching" || followStatus === "pending"
            ? "Loading..."
            : "Unfollow"}
        </button>
      )}
      {!isFollowing && (
        <button
          onClick={handleFollow}
          className={`${buttonStyle}`}
          disabled={fetchStatus === "fetching" || followStatus === "pending"}
        >
          {fetchStatus === "fetching" || followStatus === "pending"
            ? "Loading..."
            : "Follow"}
        </button>
      )}
    </div>
  );
}
