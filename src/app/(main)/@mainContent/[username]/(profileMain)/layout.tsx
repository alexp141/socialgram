import Profile from "@/components/Profile";
import { getUser } from "@/lib/actions";

export default async function layout({
  children,

  params,
  profileTabs,
}: {
  children: React.ReactNode;
  params: { username: string };
  profileTabs: React.ReactNode;
}) {
  const userId = (await getUser()).id;
  return (
    <div>
      <Profile username={params.username} userId={userId} />
      {profileTabs}
      {children}
    </div>
  );
}
