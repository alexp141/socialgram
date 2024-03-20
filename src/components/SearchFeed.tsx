"use client";

import { getSearchResultsPage } from "@/lib/data";
import { SearchParams } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { isTypePostRow } from "@/lib/helper";
import UserCard from "./UserCard";

//a more specialized version of the generic feed component
export default function SearchFeed({
  itemsPerPage,
  searchParams,
}: {
  searchParams: SearchParams;
  itemsPerPage: number;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["search"],
    queryFn: ({ pageParam }) =>
      getSearchResultsPage(pageParam, itemsPerPage, searchParams),
    initialPageParam: 1,
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
          {group.map((item) => {
            if (isTypePostRow(item)) {
              return <Post key={item.id} post={item} />;
            } else {
              return <UserCard info={item} key={item.user_id} />;
            }
          })}
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
