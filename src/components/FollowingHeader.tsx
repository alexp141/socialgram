import Link from "next/link";

export default function FollowingHeader({ username }: { username: string }) {
  return (
    <>
      <div>
        <p className="text-center">profile name</p>
        <nav className="flex justify-evenly">
          <Link href={`/${username}/followers`}>Followers</Link>
          <Link href={`/${username}/following`}>Followers</Link>
        </nav>
      </div>
    </>
  );
}
