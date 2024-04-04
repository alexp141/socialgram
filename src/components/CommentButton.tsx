"use client";

import useCommentCount from "@/hooks/useCommentCount";
import CreatePost from "./CreatePost";
import TinyLoader from "./TinyLoader";

export default function CommentButton({ postId }: { postId: number }) {
  const { commentCount, error, fetchStatus } = useCommentCount(postId);

  if (error) {
    <span>?</span>;
  }

  return (
    <div className="">
      <CreatePost replyToId={postId} displayAsCommentButton>
        {fetchStatus !== "fetching" ? (
          <span>{commentCount}</span>
        ) : (
          <TinyLoader style="flex" />
        )}
      </CreatePost>
    </div>
  );
}
