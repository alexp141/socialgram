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
    <div className="lg:min-w-[35rem] flex justify-center items-center mt-2">
      <span className="spinner-loader"></span>
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
              return (
                <UserCard
                  currUserId={userId}
                  key={item.user_id}
                  isAlreadyFollowing={isAlreadyFollowing}
                  info={item}
                />
              );
            }
          })}
        </div>
      ))}
      <div className="text-center text-amber-500 mt-6">
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
