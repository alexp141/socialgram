"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { getUserPosts } from "@/lib/data";

const POSTS_PER_PAGE = 4;

export default function UserPosts({ userId }: { userId: string }) {
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
