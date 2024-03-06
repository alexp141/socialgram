import Profile from "@/components/Profile";
import { getUser } from "@/lib/actions";

export default async function page({
  params,
}: {
  params: { username: string };
}) {
  const userId = (await getUser()).id;
  return (
    <>
      <Profile username={params.username} userId={userId} />
    </>
  );
}
