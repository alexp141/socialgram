import ExtrasContainer from "@/components/ExtrasContainer";
import FilterForm from "@/components/FilterForm";
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
    <div className="space-y-2">
      <p>EXTRAS EXPLORE ROUTE</p>
      <ExtrasContainer title="Who To Follow">
        <RecommendedUsers users={recommendedUsers} />
      </ExtrasContainer>
      <ExtrasContainer title="Filters">
        <FilterForm />
      </ExtrasContainer>
    </div>
  );
}
