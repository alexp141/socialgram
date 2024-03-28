import ExtrasContainer from "@/components/ExtrasContainer";
import FilterForm from "@/components/FilterForm";
import RecommendedUsers from "@/components/RecommendedUsers";
import { getFollowableUsers } from "@/lib/actions";
import { UsersRow } from "@/lib/types/type-collection";

export default async function ExploreFilterPage() {
  const recommendedUsers: UsersRow[] = await getFollowableUsers();

  return (
    <div>
      <div className="space-y-2 mt-2 hidden lg:block lg:sticky lg:top-4">
        <ExtrasContainer title="Who To Follow">
          <RecommendedUsers users={recommendedUsers} />
        </ExtrasContainer>
        <ExtrasContainer title="Filters">
          <FilterForm />
        </ExtrasContainer>
      </div>
    </div>
  );
}
