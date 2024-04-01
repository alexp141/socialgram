import UserPosts from "@/components/UserPosts";
import { getUserId } from "@/lib/actions";

export default async function page({
  params,
}: {
  params: { username: string };
}) {
  const profileUserId = await getUserId(params.username);

  return <UserPosts userId={profileUserId} />;
}
