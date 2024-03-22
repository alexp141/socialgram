import ExtrasContainer from "@/components/ExtrasContainer";
import RecommendedUsers from "@/components/RecommendedUsers";
import { getFollowableUsers } from "@/lib/actions";
import { UsersRow } from "@/lib/types/type-collection";

export default async function Page() {
  const recommendedUsers: UsersRow[] = await getFollowableUsers();

  return (
    <div>
      <ExtrasContainer title="Who To Follow">
        <RecommendedUsers users={recommendedUsers} />
      </ExtrasContainer>
    </div>
  );
}
