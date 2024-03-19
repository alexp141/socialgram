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
        <RecommendedUsers users={recommendedUsers} />
      </ExtrasContainer>
      <ExtrasContainer title="Filters">
        <form action="">
          <fieldset>
            <div>
              <input type="radio" name="timeSort" id="newest" />
              <label htmlFor="newest">Newest</label>
            </div>
            <div>
              <input type="radio" name="timeSort" id="oldest" />
              <label htmlFor="oldest">Oldest</label>
            </div>
          </fieldset>
        </form>
      </ExtrasContainer>
    </div>
  );
}
