import Feed from "@/components/Feed";
import { getUserId } from "@/lib/actions";
import { getNextFollowingPage } from "@/lib/data";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const userId = await getUserId(params.username);

  return (
    <div className="p-2">
      <Feed
        queryKey={["following", params.username]}
        queryFunction={getNextFollowingPage}
        initialPageParam={1}
        itemsPerPage={10}
        userId={userId}
        isAlreadyFollowing
      />
    </div>
  );
}
