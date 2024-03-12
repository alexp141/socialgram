import Feed from "@/components/Feed";
import { getUserId } from "@/lib/actions";
import { getNextFollowingPage } from "@/lib/data";

export default async function page({
  params,
}: {
  params: { username: string };
}) {
  const userId = await getUserId(params.username);

  return (
    <Feed
      queryKey={["following", params.username]}
      queryFunction={getNextFollowingPage}
      initialPageParam={1}
      itemsPerPage={4}
      userId={userId}
      isAlreadyFollowing
    />
  );
}
