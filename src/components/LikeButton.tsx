"use client";

import { getPostLikes, likePost } from "@/lib/actions";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function LikeButton({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  async function handleLike() {
    await likePost(postId, userId);
  }

  return (
    <div className="">
      <button type="button" onClick={handleLike}>
        <FaRegHeart />
      </button>
    </div>
  );
}
