import Profile from "@/components/Profile";

export default function page({ params }: { params: { username: string } }) {
  return (
    <>
      <Profile username={params.username} />
    </>
  );
}
