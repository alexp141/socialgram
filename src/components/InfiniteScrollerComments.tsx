"use client";

import { getNextCommentsPage } from "@/lib/data";
import { useInfiniteQuery } from "@tanstack/react-query";
import Comment from "./Comment";

const COMMENTS_PER_PAGE = 4;

export default function InfiniteScrollerComments({
  postId,
}: {
  postId: number;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["infinite-scroller-comments", postId],
    queryFn: ({ pageParam }) =>
      getNextCommentsPage(postId, pageParam, COMMENTS_PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < COMMENTS_PER_PAGE) {
        return null;
      }
      return lastPageParam + 1;
    },
    staleTime: Infinity,
  });

  return status === "pending" ? (
    <div className="lg:min-w-[35rem]">
      <p className="text-center">Loading...</p>
    </div>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="md:min-w-[35rem] lg:max-w-[40rem]">
      {data.pages.map((pageGroup, i) => (
        <div key={i}>
          {pageGroup.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </div>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
    </div>
  );
}
