"use client";

import { PostRow, UserCardType } from "@/lib/types/type-collection";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import UserCard from "./UserCard";
import { isTypePostRow } from "@/lib/helper";
import LoadingSpinner from "./LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Feed({
  queryKey,
  queryFunction,
  itemsPerPage,
  initialPageParam,
  userId,
  postId,
  username,
  isAlreadyFollowing = false,
}: {
  queryKey: Array<string | number>;
  queryFunction: (
    currentPage: number,
    itemsPerPage: number,
    arg3?: any
  ) => Promise<PostRow[] | UserCardType[]>;
  itemsPerPage: number;
  initialPageParam: number;
  userId?: string;
  postId?: number;
  username?: string;
  isAlreadyFollowing?: boolean;
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

  useEffect(() => {
    console.log("IN VIEW", inView);
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return status === "pending" ? (
    <LoadingSpinner />
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="">
      {data.pages.map((group, groupNumber) => (
        <div key={groupNumber} className="flex flex-col gap-2">
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
                  <div ref={ref} key={item.user_id}>
                    <UserCard
                      currUserId={userId}
                      key={item.user_id}
                      isAlreadyFollowing={isAlreadyFollowing}
                      info={item}
                    />
                  </div>
                );
              } else {
                return (
                  <UserCard
                    currUserId={userId}
                    key={item.user_id}
                    isAlreadyFollowing={isAlreadyFollowing}
                    info={item}
                  />
                );
              }
            }
          })}
        </div>
      ))}
      <div className="text-center text-sky-500 mt-6">
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
