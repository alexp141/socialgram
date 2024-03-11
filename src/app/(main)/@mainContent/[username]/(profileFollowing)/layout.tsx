import FollowingHeader from "@/components/FollowingHeader";

export default function layout({
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
