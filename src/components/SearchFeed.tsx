"use client";

import { getSearchResultsPage } from "@/lib/data";
import { SearchParams } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { isTypePostRow } from "@/lib/helper";
import UserCard from "./UserCard";
import LoadingSpinner from "./LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

//a more specialized version of the generic feed component
export default function SearchFeed({
  itemsPerPage,
  searchParams,
}: {
  searchParams: SearchParams;
  itemsPerPage: number;
}) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "search",
      searchParams.search,
      searchParams.searchFor,
      searchParams.timeSort,
    ],
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return status === "pending" ? (
    <div className="lg:min-w-[35rem]">
      <LoadingSpinner />
    </div>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="">
      {data.pages.map((group, groupNumber) => (
        <div key={groupNumber}>
          {group.map((item, itemNumber) => {
            if (isTypePostRow(item)) {
              //we know it is a post
              if (itemNumber === group.length - 1)
                return (
                  <div ref={ref}>
                    <Post key={item.id} post={item} />
                  </div>
                );
              else return <Post key={item.id} post={item} />;
            } else {
              if (itemNumber === group.length - 1) {
                return (
                  <div ref={ref}>
                    <UserCard key={item.user_id} info={item} />
                  </div>
                );
              } else {
                return <UserCard key={item.user_id} info={item} />;
              }
            }
          })}
        </div>
      ))}
      <div className="text-center">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <LoadingSpinner />
          ) : hasNextPage ? (
            "Load More"
          ) : (
            "Nothing more to load"
          )}
        </button>
      </div>
    </div>
  );
}
