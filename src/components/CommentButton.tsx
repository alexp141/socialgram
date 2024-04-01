"use client";

import useCommentCount from "@/hooks/useCommentCount";
import CreatePost from "./CreatePost";

export default function CommentButton({ postId }: { postId: number }) {
  const { commentCount, error, fetchStatus } = useCommentCount(postId);

  if (error) {
    <span>?</span>;
  }

  return (
    <div className="flex gap-1">
      <CreatePost replyToId={postId} displayAsCommentButton />
      <span>{commentCount}</span>
    </div>
  );
}
