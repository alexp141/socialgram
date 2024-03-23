import UserPosts from "@/components/UserPosts";
import { getUser } from "@/lib/actions";

export default async function page() {
  const userId = (await getUser()).id;

  return <UserPosts userId={userId} />;
}
