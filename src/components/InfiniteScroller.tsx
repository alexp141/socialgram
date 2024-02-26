"use client";

import { getNextPostsPage } from "@/lib/actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { PostRow } from "@/lib/types/type-collection";

export default function InfiniteScroller() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["infinite-scroller"],
    queryFn: ({ pageParam }) => getNextPostsPage(pageParam, 4),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 4) {
        return null;
      }
      return lastPageParam + 1;
    },
    staleTime: Infinity,
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <div key={i}>
          {group.map((post) => (
            <Post key={post.id} post={post} />
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
    </>
  );
}
