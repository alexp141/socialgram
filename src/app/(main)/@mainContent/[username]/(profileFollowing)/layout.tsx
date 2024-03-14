import FollowingHeader from "@/components/FollowingHeader";

export default async function ProfileFollowingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  return (
    <>
      <FollowingHeader username={params.username} />
      {children}
    </>
  );
}
