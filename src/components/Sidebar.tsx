import Link from "next/link";
import CreatePost from "./CreatePost";
import SignOutButton from "./SignOutButton";

export default function Sidebar() {
  return (
    <div className="hidden sm:block sm:px-8 sm:py-6">
      <div className="flex flex-col gap-4 text-lg font-semibold sticky top-4">
        <Link href="/home">Home</Link>
        <Link href="/favorites">Favorites</Link>
        <Link href="/about">About</Link>
        <CreatePost />
        <Link href="/tempuser">Profile</Link>
        <SignOutButton />
      </div>
    </div>
  );
}
