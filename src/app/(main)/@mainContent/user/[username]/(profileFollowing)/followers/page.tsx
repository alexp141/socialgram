import Feed from "@/components/Feed";
import { getUserId } from "@/lib/actions";
import { getNextFollowersPage } from "@/lib/data";

export default async function page({
  params,
}: {
  params: { username: string };
}) {
  const userId = await getUserId(params.username);

  return (
    <div className="p-2">
      <Feed
        queryKey={["followers", params.username]}
        queryFunction={getNextFollowersPage}
        initialPageParam={1}
        itemsPerPage={10}
        userId={userId}
      />
    </div>
  );
}
