import Profile from "@/components/Profile";
import { getUser } from "@/lib/actions";

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const userId = (await getUser()).id;
  return (
    <div>
      <Profile username={params.username} userId={userId} />
      {children}
    </div>
  );
}
