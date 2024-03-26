import LoadingSpinner from "@/components/LoadingSpinner";
import Profile from "@/components/Profile";
import { getUser, getUserId } from "@/lib/actions";
import { Suspense } from "react";

export default async function ProfileTabsLayout({
  children,
  params,
  profileTabs,
}: {
  children: React.ReactNode;
  params: { username: string };
  profileTabs: React.ReactNode;
}) {
  const [loggedInUserId, profileUserId] = await Promise.all([
    getUser(), //gets currently logged in user's id
    getUserId(params.username),
  ]);

  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <Profile
          username={params.username}
          profileUserId={profileUserId}
          loggedInUserId={loggedInUserId.id}
        />
        {profileTabs}
        {children}
      </Suspense>
    </div>
  );
}
