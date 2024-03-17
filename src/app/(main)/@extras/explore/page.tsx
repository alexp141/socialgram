import ExtrasContainer from "@/components/ExtrasContainer";
import RecommendedUsers from "@/components/RecommendedUsers";
import { getFollowableUsers } from "@/lib/actions";
import { SearchParams } from "@/lib/types";
import { UsersRow } from "@/lib/types/type-collection";

export default async function ExploreFilterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const recommendedUsers: UsersRow[] = await getFollowableUsers();

  return (
    <div>
      <p>EXTRAS EXPLORE ROUTE</p>
      <ExtrasContainer title="Who To Follow">
        children
        <RecommendedUsers users={recommendedUsers} />
      </ExtrasContainer>
    </div>
  );
}
