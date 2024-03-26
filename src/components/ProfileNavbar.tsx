"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNavbar({ username }: { username: string }) {
  const pathName = usePathname();
  const leaf = pathName.split("/").slice(-1).join();

  return (
    <nav className="flex justify-evenly mt-4 items-stretch text-lg text-blue-500">
      <Link
        href={`/user/${username}`}
        className={`p-4 hover:underline ${
          leaf !== "favorites" && leaf !== "likes"
            ? "underline underline-offset-8"
            : ""
        }`}
      >
        Posts
      </Link>
      <Link
        href={`/user/${username}/favorites`}
        className={`p-4 hover:underline ${
          leaf === "favorites" ? "underline underline-offset-8" : ""
        }`}
      >
        Favorites
      </Link>
      <Link
        href={`/user/${username}/likes`}
        className={`p-4 hover:underline ${
          leaf === "likes" ? "underline underline-offset-8" : ""
        }`}
      >
        Likes
      </Link>
    </nav>
  );
}
