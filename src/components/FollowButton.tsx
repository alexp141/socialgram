"use client";

import { followUser } from "@/lib/actions";
import { toast } from "react-toastify";

export default function FollowButton({
  userToFollow,
}: {
  userToFollow: string;
}) {
  async function handleFollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const res = await followUser(userToFollow);
    if (res.error) {
      console.error(res.error);
      toast.error(res.error);
      return;
    }

    toast.success("user successfully followed");
  }

  return <button onClick={handleFollow}>Follow</button>;
}
