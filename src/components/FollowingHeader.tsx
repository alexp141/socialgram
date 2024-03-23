"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FollowingHeader({ username }: { username: string }) {
  const pathName = usePathname();
  const leaf = pathName.split("/").slice(-1).join();
  console.log("pathname", leaf);
  return (
    <>
      <div>
        <Link
          href={`/user/${username}`}
          className="hover:underline flex justify-center"
        >
          @{username}
        </Link>
        <nav className="flex justify-evenly">
          <Link
            href={`/user/${username}/followers`}
            className={`hover:underline ${
              leaf === "followers" ? "text-blue-400 underline" : ""
            }`}
          >
            Followers
          </Link>
          <Link
            href={`/user/${username}/following`}
            className={`hover:underline ${
              leaf === "following" ? "text-blue-400 underline" : ""
            }`}
          >
            Following
          </Link>
        </nav>
      </div>
    </>
  );
}
