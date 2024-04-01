"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { getUserPosts } from "@/lib/data";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const POSTS_PER_PAGE = 4;

export default function UserPosts({ userId }: { userId: string }) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["user-posts"],
    queryFn: ({ pageParam }) => getUserPosts(pageParam, POSTS_PER_PAGE, userId),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < POSTS_PER_PAGE) {
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
          {group.map((post, postIndex) => {
            if (postIndex === group.length - 1)
              return (
                <div ref={ref} key={post.id}>
                  <Post key={post.id} post={post} />
                </div>
              );
            else return <Post key={post.id} post={post} />;
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
