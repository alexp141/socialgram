import Link from "next/link";

export default function FollowingHeader({ username }: { username: string }) {
  return (
    <>
      <div>
        <p className="text-center">profile name</p>
        <nav className="flex justify-evenly">
          <Link
            href={`/user/${username}/followers`}
            className="hover:underline"
          >
            Followers
          </Link>
          <Link
            href={`/user/${username}/following`}
            className="hover:underline"
          >
            Following
          </Link>
        </nav>
      </div>
    </>
  );
}
