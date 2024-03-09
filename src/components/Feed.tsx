"use client";

import { PostRow } from "@/lib/types/type-collection";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";

export default function Feed({
  queryKey,
  queryFunction,
  itemsPerPage,
  initialPageParam,
}: {
  queryKey: string;
  queryFunction: (
    currentPage: number,
    itemsPerPage: number,
    arg3?: any
  ) => Promise<PostRow[]>;
  itemsPerPage: number;
  initialPageParam: number;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: [`${queryKey}`],
    queryFn: ({ pageParam }) => queryFunction(pageParam, itemsPerPage),
    initialPageParam,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < itemsPerPage) {
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
    <div className="md:min-w-[35rem] lg:max-w-[40rem] border-x border-red-500">
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
