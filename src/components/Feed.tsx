"use client";

import { FavoritesRow, PostRow } from "@/lib/types/type-collection";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";

export default function Feed({
  queryKey,
  queryFunction,
  itemsPerPage,
  initialPageParam,
  userId,
  postId,
  username,
}: {
  queryKey: Array<string | number>;
  queryFunction: (
    currentPage: number,
    itemsPerPage: number,
    arg3?: any
  ) => Promise<PostRow[]>;
  itemsPerPage: number;
  initialPageParam: number;
  userId?: string;
  postId?: number;
  username?: string;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      queryFunction(pageParam, itemsPerPage, userId || postId || username),
    initialPageParam,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < itemsPerPage) {
        return null;
      }
      return lastPageParam + 1;
    },
    staleTime: Infinity,
    refetchOnMount: "always",
  });

  return status === "pending" ? (
    <div className="lg:min-w-[35rem]">
      <p className="text-center">Loading...</p>
    </div>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="">
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
    </div>
  );
}
