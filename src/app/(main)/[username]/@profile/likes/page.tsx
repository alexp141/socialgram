import Feed from "@/components/Feed";
import { getUserLikes } from "@/lib/data";

export default function LikesPage({
  params,
}: {
  params: { username: string };
}) {
  return (
    <Feed
      queryKey={["favorites", params.username]}
      queryFunction={getUserLikes}
      initialPageParam={1}
      itemsPerPage={4}
      username={params.username}
    />
  );
}
