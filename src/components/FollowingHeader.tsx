"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FollowingHeader({ username }: { username: string }) {
  const pathName = usePathname();
  const leaf = pathName.split("/").slice(-1).join();

  return (
    <>
      <div>
        <Link
          href={`/user/${username}`}
          className="hover:underline flex justify-center text-sky-500 hover:underline-offset-4"
        >
          @{username}
        </Link>
        <nav className="flex justify-evenly">
          <Link
            href={`/user/${username}/following`}
            className={`hover:underline ${
              leaf === "following"
                ? "text-sky-500 underline underline-offset-4"
                : ""
            }`}
          >
            Following
          </Link>
          <Link
            href={`/user/${username}/followers`}
            className={`hover:underline ${
              leaf === "followers"
                ? "text-sky-500 underline underline-offset-4"
                : ""
            }`}
          >
            Followers
          </Link>
        </nav>
      </div>
    </>
  );
}
