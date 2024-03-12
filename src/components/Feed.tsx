"use client";

import {
  FavoritesRow,
  PostRow,
  UserCardType,
  UsersRow,
} from "@/lib/types/type-collection";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import UserCard from "./UserCard";
import { isTypePostRow } from "@/lib/helper";

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
  ) => Promise<PostRow[] | UserCardType[]>;
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
          {group.map((item) => {
            if (isTypePostRow(item)) {
              //we know it is a post
              return <Post key={item.id} post={item} />;
            } else {
              return <UserCard key={item.user_id} info={item} />;
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